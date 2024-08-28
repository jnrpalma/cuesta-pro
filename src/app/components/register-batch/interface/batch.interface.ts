import { Animal } from "../../register-animal/interface/animal.interface";

export interface Batch {
  id: string;
  nomeLote: string;
  categoria: string;
  animais: Animal[];
  dataCadastro?: Date | null; // Permite que dataCadastro seja opcional ou nulo
  firestoreId?: string;
}
