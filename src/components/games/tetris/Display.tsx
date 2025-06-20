import React from "react";

type Props = {
  gameOver?: boolean;
  text: string;
};

const displayStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  margin: "0 0 20px 0",
  padding: "20px",
  border: "4px solid var(--cor-borda)",
  minHeight: "30px",
  width: "100%",
  borderRadius: "20px",
  color: "var(--cor-texto-secundario)",
  background: "var(--cor-fundo)",
  fontFamily: '"Press Start 2P", sans-serif', // Uma fonte estilo pixel seria legal aqui
  fontSize: "1rem",
};

const Display: React.FC<Props> = ({ gameOver, text }) => (
  <div
    style={{
      ...displayStyle,
      color: gameOver ? "var(--cor-perigo)" : "var(--cor-texto-secundario)",
    }}
  >
    {text}
  </div>
);

export default Display;
