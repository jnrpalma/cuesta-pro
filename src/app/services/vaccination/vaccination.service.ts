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


  // vaccination.service.ts
deleteVaccinationsByAnimalId(animalId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.firestore.collection(this.collectionName, ref => ref.where('animalId', '==', animalId))
      .get()
      .subscribe(querySnapshot => {
        const batch = this.firestore.firestore.batch();
        
        querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        batch.commit().then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
  });
}



}
