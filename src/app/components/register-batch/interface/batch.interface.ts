// src/app/interfaces/batch.interface.ts

import { Animal } from "../../register-animal/interface/animal.interface";



export interface Batch {
  id: string;
  nomeLote: string;
  categoria: string;
  animais: Animal[];
}
