// src/data/gamesData.ts

// Importando apenas os tipos que precisamos para os ícones
import type { IconType } from 'react-icons';
import { HiOutlineHashtag } from 'react-icons/hi';
import { BsFillPuzzleFill } from 'react-icons/bs';

// O tipo agora é mais simples: não inclui mais o 'component'.
export interface GameInfo {
  id: string;
  name: string;
  description: string;
  theme: string;
  Icon: IconType;
}

// A lista agora contém apenas as informações do jogo.
export const gamesList: GameInfo[] = [
  { 
    id: 'jogo-da-velha', 
    name: 'Jogo da Velha', 
    description: 'O clássico atemporal. Desafie um amigo ou o computador.', 
    theme: 'theme-tictactoe',
    Icon: HiOutlineHashtag
  },
  { 
    id: 'genius', 
    name: 'Jogo da Memória (Genius)', 
    description: 'Teste sua memória e agilidade seguindo a sequência de cores.', 
    theme: 'theme-genius',
    Icon: BsFillPuzzleFill
  }
];

// O mapa agora também é mais simples.
export const gamesInfoMap = new Map(gamesList.map(game => [game.id, game]));