import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Batch } from '../../components/register-batch/interface/batch.interface';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private collectionName = 'batches';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Adiciona um novo lote ao Firebase Firestore.
   * @param batch Lote a ser adicionado.
   * @returns Promise que resolve quando o lote é adicionado.
   */
  addBatch(batch: Batch): Promise<void> {
    const id = this.firestore.createId();
    batch.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(batch);
  }

  /**
   * Obtém todos os lotes do Firebase Firestore.
   * @returns Observable que emite um array de lotes.
   */
  getBatches(): Observable<Batch[]> {
    return this.firestore.collection<Batch>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Batch;
        const firestoreId = a.payload.doc.id;
        return { ...data, firestoreId };
      }))
    );
  }

  /**
   * Deleta um lote do Firebase Firestore.
   * @param firestoreId Firestore ID do lote a ser deletado.
   * @returns Promise que resolve quando o lote é deletado.
   */
  deleteBatch(firestoreId: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(firestoreId).delete()
      .then(() => console.log(`Lote com Firestore ID ${firestoreId} excluído com sucesso`))
      .catch(error => {
        console.error(`Erro ao excluir lote com Firestore ID ${firestoreId}:`, error);
        throw error;
      });
  }

  /**
   * Verifica se já existe um lote com a mesma categoria no Firebase Firestore.
   * @param categoria Categoria do lote a ser verificado.
   * @returns Observable que emite true se o lote existir, false caso contrário.
   */
  batchExists(categoria: string): Observable<boolean> {
    return this.firestore.collection<Batch>(this.collectionName, ref => ref.where('categoria', '==', categoria)).snapshotChanges().pipe(
      map(actions => actions.length > 0)
    );
  }

  getLoteByCategoria(categoria: string): Observable<Batch> {
    return this.firestore.collection<Batch>(this.collectionName, ref => ref.where('categoria', '==', categoria))
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length > 0) {
            const data = actions[0].payload.doc.data() as Batch;
            const firestoreId = actions[0].payload.doc.id;
            return { ...data, firestoreId };
          } else {
            throw new Error('Lote não encontrado para essa categoria');
          }
        })
      );
  }
}
