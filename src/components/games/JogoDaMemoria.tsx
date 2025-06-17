// src/components/games/JogoDaMemoria.tsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './JogoDaMemorias.css';

const colors = ['green', 'red', 'yellow', 'blue'];

type WindowWithAudioContext = Window & typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
};

export function JogoDaMemoria() {
    const { currentUser } = useAuth();
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [activeColor, setActiveColor] = useState('');
    const [message, setMessage] = useState('Aperte Iniciar para começar!');
    const [isGameActive, setIsGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // MUDANÇA: Busca o high score do documento principal do usuário
    const fetchHighScore = useCallback(async () => {
        if (!currentUser) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            setHighScore(userDocSnap.data().geniusHighScore || 0);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchHighScore();
    }, [fetchHighScore]);

    // MUDANÇA: Salva o high score no documento principal do usuário
    const updateHighScore = async (newScore: number) => {
        if (!currentUser || newScore <= highScore) return;

        setHighScore(newScore);
        const userDocRef = doc(db, 'users', currentUser.uid);

        await setDoc(userDocRef, {
            geniusHighScore: newScore,
            displayName: currentUser.displayName, // Garante que o nome esteja no doc para a leaderboard
            photoURL: currentUser.photoURL      // Garante que o avatar esteja no doc para a leaderboard
        }, { merge: true });
    };

    const playSound = (color: string) => {
        try {
            const AudioContextClass = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
            if (!AudioContextClass) {
                console.warn("AudioContext não é suportado neste navegador.");
                return;
            }
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const frequencies: { [key: string]: number } = { green: 329.63, red: 392.00, yellow: 440.00, blue: 523.25 };
            oscillator.frequency.setValueAtTime(frequencies[color], audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.error("Erro ao tocar o som:", error);
        }
    };

    const nextStep = useCallback(() => {
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        setSequence(prev => [...prev, nextColor]);
        setPlayerSequence([]);
    }, []);

    const startGame = () => {
        setSequence([]); setPlayerSequence([]); setScore(0);
        setIsGameActive(true); setMessage('Observe a sequência...');
        setTimeout(nextStep, 1000);
    };

    useEffect(() => {
        if (isGameActive && sequence.length > 0) {
            setMessage('Observe a sequência...');
            const showSequence = (index = 0) => {
                if (index < sequence.length) {
                    setActiveColor(sequence[index]);
                    playSound(sequence[index]);
                    setTimeout(() => {
                        setActiveColor('');
                        setTimeout(() => showSequence(index + 1), 250);
                    }, 500);
                } else {
                    setMessage('Sua vez!');
                }
            };
            showSequence();
        }
    }, [sequence, isGameActive]);

    const handlePlayerClick = (color: string) => {
        if (!isGameActive || message !== 'Sua vez!') return;
        playSound(color);
        const newPlayerSequence = [...playerSequence, color];
        setPlayerSequence(newPlayerSequence);
        if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
            setMessage(`Fim de jogo! Sua pontuação: ${score}.`);
            setIsGameActive(false);
            updateHighScore(score); // Salva o high score quando o jogo termina
            return;
        }
        if (newPlayerSequence.length === sequence.length) {
            const newScore = score + 1;
            setScore(newScore);
            setTimeout(nextStep, 1000);
        }
    };

    return (
        <div className="genius-container">
            <div className="genius-board">
                {colors.map(color => (
                    <div key={color} onClick={() => handlePlayerClick(color)} className={`genius-pad ${color} ${activeColor === color ? 'active' : ''}`}></div>
                ))}
                <div className="genius-center">
                    <div className="score-display">Recorde: {highScore}</div>
                    <h2>Pontos: {score}</h2>
                    <p className="genius-message">{message}</p>
                    {!isGameActive && <button onClick={startGame} className="start-button">Iniciar</button>}
                </div>
            </div>
        </div>
    );
}