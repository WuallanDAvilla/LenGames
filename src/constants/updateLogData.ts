export interface UpdateEntry {
  version: string;
  description: string;
}

export const updateLogEntries: UpdateEntry[] = [
  {
    version: "1.0.3",
    description: "Implementando mais capas de jogos e melhorias visuais.",
  },
  {
    version: "1.0.2",
    description: "Novos jogos adicionados: Space Invaders e Xadrez!",
  },
  {
    version: "1.0.1",
    description: "Correção de bugs menores na responsividade.",
  },
  {
    version: "1.0.0",
    description: "Lançamento inicial da plataforma LenGames! 🎉",
  },
  {
    version: "0.9.9",
    description: "Adição de novos recursos de autenticação com Firebase.",
  },
  {
    version: "0.9.8",
    description: "Melhorias de desempenho no carregamento dos jogos.",
  },
];
