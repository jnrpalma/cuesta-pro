import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private collectionName = 'batches';

  constructor(private firestore: AngularFirestore) {}

  addBatch(batch: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ id, ...batch });
  }

  getBatches(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges();
  }
}
