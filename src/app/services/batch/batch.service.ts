import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Certifique-se de importar 'map' corretamente
import { Batch } from '../../components/register-batch/interface/batch.interface';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private collectionName = 'batches';

  constructor(private firestore: AngularFirestore) {}

  addBatch(batch: Batch): Promise<void> {
    const id = this.firestore.createId();
    batch.id = id; // Definir o id diretamente no objeto batch
    return this.firestore.collection(this.collectionName).doc(id).set(batch);
  }

  getBatches(): Observable<Batch[]> {
    return this.firestore.collection<Batch>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Batch;
        const firestoreId = a.payload.doc.id;
        return { ...data, firestoreId }; // Adicionar o Firestore ID ao retorno
      }))
    );
  }

  deleteBatch(firestoreId: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(firestoreId).delete()
      .then(() => console.log(`Lote com Firestore ID ${firestoreId} excluído com sucesso`))
      .catch(error => {
        console.error(`Erro ao excluir lote com Firestore ID ${firestoreId}:`, error);
        throw error; // Propagar o erro para ser tratado no componente
      });
  }
}
