import { useState, useCallback } from "react";
import { TETROMINOS } from "./tetrominos";
import { STAGE_WIDTH, checkCollision, randomTetrominoKey } from "./gameHelpers";
import type { PLAYER, STAGE } from "./gameHelpers";

export const usePlayer = (): [
  PLAYER,
  (pos: { x: number; y: number; collided: boolean }) => void,
  () => void,
  (stage: STAGE, dir: number) => void
] => {
  const createInitialPlayer = (): PLAYER => ({
    pos: { x: 0, y: 0 },
    tetromino: JSON.parse(JSON.stringify(TETROMINOS[0].shape)),
    collided: false,
  });

  const [player, setPlayer] = useState<PLAYER>(createInitialPlayer());

  const rotate = (matrix: PLAYER["tetromino"], dir: number) => {
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage: STAGE, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    const newKey = randomTetrominoKey();
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: JSON.parse(JSON.stringify(TETROMINOS[newKey].shape)),
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};
