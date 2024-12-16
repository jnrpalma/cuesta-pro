import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../components/register-animal/interface/animal.interface';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private collectionName = 'animals';  // Nome da coleção no Firestore
  private lastVisible: any = null;     // Armazena o último documento visível para paginação

  constructor(private firestore: AngularFirestore) {}

  // Adiciona um novo animal ao Firestore
  addAnimal(animal: Animal): Promise<void> {
    const firestoreId = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(firestoreId).set({ firestoreId, ...animal });
  }

  // Obtém uma lista de animais com suporte a paginação
  getAnimals(page: number, pageSize: number): Observable<Animal[]> {
    let query = this.firestore.collection<Animal>(this.collectionName, ref => {
      let q = ref.orderBy('id').limit(pageSize);
      if (this.lastVisible && page > 1) {
        q = q.startAfter(this.lastVisible); // Começa após o último documento visível
      }
      return q;
    });

    return query.snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          this.lastVisible = actions[actions.length - 1].payload.doc; // Atualiza o último documento visível
        }
        return actions.map(a => {
          const data = a.payload.doc.data() as Animal;
          const firestoreId = a.payload.doc.id;
          return { ...data, firestoreId };
        });
      })
    );
  }

  // Obtém todos os animais sem paginação
  getAllAnimals(): Observable<Animal[]> {
    return this.firestore.collection<Animal>(this.collectionName).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Animal;
          const firestoreId = a.payload.doc.id;
          return { ...data, firestoreId };
        })
      )
    );
  }
  

  // Obtém um animal específico pelo ID
  getAnimalById(id: string): Observable<Animal> {
    return this.firestore.collection(this.collectionName).doc<Animal>(id).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Animal;
        const firestoreId = a.payload.id;
        return { ...data, firestoreId };
      })
    );
  }

  // Atualiza os dados de um animal existente
  updateAnimal(animal: Animal): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(animal.firestoreId).update(animal);
  }

  // Exclui um animal pelo ID do Firestore
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

  // Reseta o controle de paginação
  resetPagination() {
    this.lastVisible = null;
  }
}
