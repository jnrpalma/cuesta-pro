import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../components/register-animal/interface/animal.interface';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private collectionName = 'animals';

  constructor(private firestore: AngularFirestore) {}

  addAnimal(animal: Animal): Promise<void> {
    const firestoreId = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(firestoreId).set({ firestoreId, ...animal });
  }

  getAnimals(): Observable<Animal[]> {
    return this.firestore.collection<Animal>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Animal;
        const firestoreId = a.payload.doc.id;
        return { ...data, firestoreId }; // Adicionando o Firestore ID sem sobrescrever o ID do brinco
      }))
    );
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.firestore.collection(this.collectionName).doc<Animal>(id).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Animal;
        const firestoreId = a.payload.id;
        return { ...data, firestoreId };
      })
    );
  }

  updateAnimal(animal: Animal): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(animal.firestoreId).update(animal);
  }

  deleteAnimal(firestoreId: string): Promise<void> {
    console.log('Iniciando exclusão no serviço para o Firestore ID:', firestoreId);
    return this.firestore.collection(this.collectionName).doc(firestoreId).delete()
      .then(() => {
        console.log(`Documento com Firestore ID ${firestoreId} excluído do Firestore`);
        return this.firestore.collection(this.collectionName).get().toPromise().then(snapshot => {
          if (snapshot) {
            console.log('Documentos restantes após a exclusão:');
            snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
            });
          } else {
            console.log('Snapshot é indefinido.');
          }
        });
      })
      .catch(error => console.error(`Erro ao excluir documento com Firestore ID ${firestoreId}:`, error));
  }
}
