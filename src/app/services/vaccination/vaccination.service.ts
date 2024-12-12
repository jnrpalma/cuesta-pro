import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  private collectionName = 'vaccinations'; // Nome da coleção no Firestore

  constructor(private firestore: AngularFirestore) {}

  // Obtém todas as vacinações
  getVaccinations(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Adiciona uma nova vacinação
  applyVaccination(vaccination: any): Promise<void> {
    const id = this.firestore.createId(); // Gera um ID único para o documento
    return this.firestore.collection(this.collectionName).doc(id).set({ id, ...vaccination });
  }
}
