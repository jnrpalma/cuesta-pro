import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VaccinationService {
  private collectionName = 'vaccinations';
  private injector: Injector = inject(Injector);

  constructor(private firestore: AngularFirestore) {}

  getVaccinations(): Observable<any[]> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).valueChanges()
    );
  }

  applyVaccination(vaccination: any): Promise<void> {
    const id = this.firestore.createId();
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection(this.collectionName)
        .doc(id)
        .set({ id, ...vaccination })
    );
  }

  deleteVaccinationsByAnimalId(animalId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      runInInjectionContext(this.injector, () => {
        this.firestore
          .collection(this.collectionName, (ref) =>
            ref.where('animalId', '==', animalId)
          )
          .get()
          .subscribe(
            (querySnapshot) => {
              const batch = this.firestore.firestore.batch();

              querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
              });

              batch
                .commit()
                .then(() => resolve())
                .catch((error) => reject(error));
            },
            (error) => reject(error)
          );
      });
    });
  }
}
