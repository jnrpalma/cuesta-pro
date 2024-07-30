export interface Animal {
  id: string; // ID do brinco
  firestoreId?: string; // ID gerado pelo Firestore, opcional
  genero: string;
  categoria: string;
  data: Date | null;
  dataNascimento: Date | null; 
  peso: number; 
  raca: string;
  registradoPor: string;
  denticao: string;
  quantity: number; 
  paiAnimal: string; 
  nomePai: string; 
  maeAnimal: string; 
  nomeMae: string; 
}
