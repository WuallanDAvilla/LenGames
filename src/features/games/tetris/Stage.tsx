import React from "react";
import Cell from "./Cell";
import type { STAGE } from "./gameHelpers";

type Props = {
  stage: STAGE;
};

const stageStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: `repeat(12, 1fr)`,
  gridTemplateRows: `repeat(20, clamp(15px, 4vh, 40px))`,
  gridGap: "1px",
  border: "2px solid var(--cor-borda)",
  width: "100%",
  background: "var(--cor-fundo)",
};

const Stage: React.FC<Props> = ({ stage }) => (
  <div style={stageStyle}>
    {stage.map((row, y) =>
      row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
    )}
  </div>
);

export default Stage;
