// src/components/games/JogoDaMemoria.tsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
// Importe a NOVA função do firebase.ts
import { updateUserHighScore } from "../../firebase";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./JogoDaMemorias.css";

const colors = ["green", "red", "yellow", "blue"];
const GAME_ID = "genius"; // Definimos o ID do jogo como uma constante

type WindowWithAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function JogoDaMemoria() {
  const { currentUser } = useAuth();
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState("");
  const [message, setMessage] = useState("Aperte Iniciar para começar!");
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const fetchHighScore = useCallback(async () => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Buscamos o score do objeto highScores
      setHighScore(userDocSnap.data().highScores?.[GAME_ID] || 0);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchHighScore();
  }, [fetchHighScore]);

  // A função de update agora é um wrapper para a nossa função centralizada
  const handleGameEnd = async (finalScore: number) => {
    if (currentUser) {
      await updateUserHighScore(currentUser.uid, GAME_ID, finalScore);
      // Atualiza o high score local se for o caso
      if (finalScore > highScore) {
        setHighScore(finalScore);
      }
    }
  };

  const playSound = (color: string) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as WindowWithAudioContext).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("AudioContext não é suportado neste navegador.");
        return;
      }
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const frequencies: { [key: string]: number } = {
        green: 329.63,
        red: 392.0,
        yellow: 440.0,
        blue: 523.25,
      };
      oscillator.frequency.setValueAtTime(
        frequencies[color],
        audioContext.currentTime
      );
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.3
      );
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
    setSequence((prev) => [...prev, nextColor]);
    setPlayerSequence([]);
  }, []);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setIsGameActive(true);
    setMessage("Observe a sequência...");
    setTimeout(nextStep, 1000);
  };

  useEffect(() => {
    if (isGameActive && sequence.length > 0) {
      setMessage("Observe a sequência...");
      const showSequence = (index = 0) => {
        if (index < sequence.length) {
          setActiveColor(sequence[index]);
          playSound(sequence[index]);
          setTimeout(() => {
            setActiveColor("");
            setTimeout(() => showSequence(index + 1), 250);
          }, 500);
        } else {
          setMessage("Sua vez!");
        }
      };
      showSequence();
    }
  }, [sequence, isGameActive]);

  const handlePlayerClick = (color: string) => {
    if (!isGameActive || message !== "Sua vez!") return;
    playSound(color);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    if (
      newPlayerSequence[newPlayerSequence.length - 1] !==
      sequence[newPlayerSequence.length - 1]
    ) {
      setMessage(`Fim de jogo! Sua pontuação: ${score}.`);
      setIsGameActive(false);
      handleGameEnd(score); // Usamos a nova função de fim de jogo
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
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handlePlayerClick(color)}
            className={`genius-pad ${color} ${
              activeColor === color ? "active" : ""
            }`}
          ></div>
        ))}
        <div className="genius-center">
          <div className="score-display">Recorde: {highScore}</div>
          <h2>Pontos: {score}</h2>
          <p className="genius-message">{message}</p>
          {!isGameActive && (
            <button onClick={startGame} className="start-button">
              Iniciar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
