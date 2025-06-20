import coverTicTacToe from "../assets/game-covers/jogodavelha.png";
import coverGenius from "../assets/game-covers/jogodamemoria.png";
import coverSnake from "../assets/game-covers/jogodamemoria.png";
import coverChess from "../assets/game-covers/jogodamemoria.png";
// NOVO: Importe a capa do Tetris
import coverTetris from "../assets/game-covers/jogodamemoria.png";

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  theme: string;
  coverImage: string;
}

export const gamesList: GameInfo[] = [
  {
    id: "jogo-da-velha",
    name: "Jogo da Velha",
    description: "O clássico atemporal. Desafie um amigo ou o computador.",
    theme: "theme-tictactoe",
    coverImage: coverTicTacToe,
  },
  {
    id: "genius",
    name: "Jogo da Memória (Genius)",
    description: "Teste sua memória e agilidade seguindo a sequência de cores.",
    theme: "theme-genius",
    coverImage: coverGenius,
  },
  {
    id: "jogo-da-cobrinha",
    name: "Jogo da Cobrinha",
    description:
      "Coma as frutas e cresça, mas não bata nas paredes ou em si mesmo!",
    theme: "theme-snake",
    coverImage: coverSnake,
  },
  {
    id: "xadrez",
    name: "Xadrez",
    description:
      "O jogo de estratégia definitivo. Desafie nossa IA e teste suas habilidades.",
    theme: "theme-chess",
    coverImage: coverChess,
  },
  // NOVO: Adicione o objeto do jogo de Tetris
  {
    id: "tetris",
    name: "Tetris",
    description: "Empilhe os blocos e complete linhas neste clássico viciante!",
    theme: "theme-tetris",
    coverImage: coverTetris,
  },
];

export const gamesInfoMap = new Map(gamesList.map((game) => [game.id, game]));
