import React from "react";
import { TETROMINOS } from "./tetrominos";
import type { TetrominoKey } from "./gameHelpers";

type Props = {
  type: TetrominoKey | 0;
};

const Cell: React.FC<Props> = ({ type }) => {
  const color = type === 0 ? "0, 0, 0" : TETROMINOS[type].color;

  const cellStyle: React.CSSProperties = {
    width: "auto",
    background: `rgba(${color}, 0.8)`,
    border: type === 0 ? "0px solid" : "4px solid",
    borderBottomColor: `rgba(${color}, 0.1)`,
    borderRightColor: `rgba(${color}, 1)`,
    borderTopColor: `rgba(${color}, 1)`,
    borderLeftColor: `rgba(${color}, 0.3)`,
  };

  return <div style={cellStyle} />;
};

export default React.memo(Cell);
