// src/components/games/JogoDaMemoria.tsx

import { useState, useEffect } from 'react';
import  './JogoDaMemorias.css';

const colors = ['green', 'red', 'yellow', 'blue'];

export function JogoDaMemoria() {
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [activeColor, setActiveColor] = useState('');
    const [message, setMessage] = useState('Aperte Iniciar para começar!');
    const [isGameActive, setIsGameActive] = useState(false);
    const [score, setScore] = useState(0);

    // Função para tocar um som simples (requer interação do usuário primeiro)
    const playSound = (color: string) => {
        try {
            const audioContext = new (window.AudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            const frequencies: { [key: string]: number } = {
                green: 329.63, red: 392.00, yellow: 440.00, blue: 523.25
            };

            oscillator.frequency.setValueAtTime(frequencies[color], audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log("Não foi possível tocar o som:", error);
        }
    };

    const nextStep = () => {
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        setSequence(prev => [...prev, nextColor]);
        setPlayerSequence([]);
    };

    const startGame = () => {
        setSequence([]);
        setPlayerSequence([]);
        setScore(0);
        setIsGameActive(true);
        setMessage('Observe a sequência...');
        setTimeout(nextStep, 1000);
    };

    useEffect(() => {
        if (isGameActive && sequence.length > 0) {
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
            setMessage(`Fim de jogo! Sua pontuação: ${score}. Aperte Iniciar.`);
            setIsGameActive(false);
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            setScore(prev => prev + 1);
            setMessage('Observe a sequência...');
            setTimeout(nextStep, 1000);
        }
    };

    return (
        <div className="genius-container">
            <div className="genius-board">
                {colors.map(color => (
                    <div
                        key={color}
                        onClick={() => handlePlayerClick(color)}
                        className={`genius-pad ${color} ${activeColor === color ? 'active' : ''}`}
                    ></div>
                ))}
                <div className="genius-center">
                    <h2>Pontos: {score}</h2>
                    <p className="genius-message">{message}</p>
                    {!isGameActive && <button onClick={startGame} className="start-button">Iniciar</button>}
                </div>
            </div>
        </div>
    );
}