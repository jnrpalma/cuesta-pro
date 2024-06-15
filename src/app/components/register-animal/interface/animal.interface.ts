export interface Animal {
  id: string;
  genero: string;
  categoria: string;
  data: Date | null;
  dataNascimento: Date | null; // Novo campo
  peso: number;  // Novo campo
  raca: string;
  registradoPor: string;
  denticao: string;  // Novo campo
  quantity: number; // Novo campo
  paiAnimal: string; // Modificado para string
  nomePai: string; // Novo campo
  maeAnimal: string; // Modificado para string
  nomeMae: string; // Novo campo
}
