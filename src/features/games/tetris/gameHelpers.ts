import { TETROMINOS } from "./tetrominos";

export type TetrominoKey = keyof typeof TETROMINOS;

export type STAGECELL = [TetrominoKey | 0, string];
export type STAGE = STAGECELL[][];

export type PLAYER = {
  pos: { x: number; y: number };
  tetromino: (TetrominoKey | 0)[][];
  collided: boolean;
};

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = (): STAGE =>
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, "clear"]));

export const checkCollision = (
  player: PLAYER,
  stage: STAGE,
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        if (
          !stage[y + player.pos.y + moveY] ||
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            "clear"
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const randomTetrominoKey = (): TetrominoKey => {
  const tetrominos: TetrominoKey[] = ["I", "J", "L", "O", "S", "T", "Z"];
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return randTetromino;
};
