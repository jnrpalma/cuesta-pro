import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private collectionName = 'animals';

  constructor(private firestore: AngularFirestore) {}

  addAnimal(animal: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ id, ...animal });
  }

  getAnimals(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges();
  }
}
