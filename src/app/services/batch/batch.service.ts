import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
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
    return this.firestore.collection<Batch>(this.collectionName).valueChanges();
  }
}
