import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Batch } from '../../components/register-batch/interface/batch.interface';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private collectionName = 'batches';
  private injector: Injector = inject(Injector);

  constructor(private firestore: AngularFirestore) {}

  addBatch(batch: Batch): Promise<void> {
    const id = this.firestore.createId();
    batch.id = id;
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).doc(id).set(batch)
    );
  }

  getBatches(): Observable<Batch[]> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection<Batch>(this.collectionName)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data() as Batch;
              const firestoreId = a.payload.doc.id;
              return { ...data, firestoreId };
            })
          )
        )
    );
  }

  deleteBatch(firestoreId: string): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).doc(firestoreId).delete()
    )
      .then(() => {
        console.log(`Lote com Firestore ID ${firestoreId} excluído com sucesso`);
      })
      .catch(error => {
        console.error(`Erro ao excluir lote com Firestore ID ${firestoreId}:`, error);
        throw error;
      });
  }

  batchExists(categoria: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection<Batch>(this.collectionName, ref => ref.where('categoria', '==', categoria))
        .snapshotChanges()
        .pipe(map(actions => actions.length > 0))
    );
  }

  getLoteByCategoria(categoria: string): Observable<Batch> {
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection<Batch>(this.collectionName, ref => ref.where('categoria', '==', categoria))
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
        )
    );
  }
}
