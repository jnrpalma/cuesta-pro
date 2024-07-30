import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Animal } from '../../components/register-animal/interface/animal.interface';

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

  getAnimals(): Observable<Animal[]> {
    return this.firestore.collection<Animal>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Animal;
        const id = a.payload.doc.id;
        return { ...data, id }; // Colocando o 'id' no final para não sobrescrever
      }))
    );
  }
  

  deleteAnimal(id: string): Promise<void> {
    console.log('Iniciando exclusão no serviço para o ID:', id);
    return this.firestore.collection(this.collectionName).doc(id).delete()
      .then(() => {
        console.log(`Documento com ID ${id} excluído do Firestore`);
        // Verificando os documentos restantes após a exclusão
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
      .catch(error => console.error(`Erro ao excluir documento com ID ${id}:`, error));
  }
  
  
  
  
}
