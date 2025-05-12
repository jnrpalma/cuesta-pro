import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../components/register-animal/interface/animal.interface';
import { VaccinationService } from '../vaccination/vaccination.service';

@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private animalsCollection = 'animals';
  private deceasedName = 'deceasedAnimals';
  private lastDocument: any = null;

  private injector: Injector = inject(Injector);

  constructor(
    private firestore: AngularFirestore,
    private vaccinationService: VaccinationService
  ) {}

  addAnimal(animal: Animal): Promise<void> {
    const animalId = this.firestore.createId();
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.animalsCollection).doc(animalId).set({ animalId, ...animal })
    );
  }

  updateAnimal(animal: Animal): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.animalsCollection).doc(animal.firestoreId).update(animal)
    );
  }

  async handleAnimalDeath(animalId: string): Promise<void> {
    try {
      const animalDocSnapshot = await firstValueFrom(
        runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.animalsCollection).doc(animalId).get()
        )
      );

      if (animalDocSnapshot.exists) {
        const deceasedAnimalData = animalDocSnapshot.data();
        await runInInjectionContext(this.injector, () =>
          this.firestore.collection('deceasedAnimals').add(deceasedAnimalData)
        );
        await runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.animalsCollection).doc(animalId).delete()
        );

        await this.vaccinationService.deleteVaccinationsByAnimalId(animalId);
        console.log(`Animal ${animalId} moved and deleted successfully.`);
      } else {
        console.error('Animal not found in Firestore.');
        throw new Error('Animal not found or document is undefined');
      }
    } catch (error) {
      console.error(`Error processing animal ${animalId}:`, error);
      throw error;
    }
  }

  getAnimals(page: number, pageSize: number): Observable<Animal[]> {
    return runInInjectionContext(this.injector, () => {
      let query = this.firestore.collection<Animal>(
        this.animalsCollection,
        (ref) => {
          let q = ref.orderBy('id').limit(pageSize);
          if (this.lastDocument && page > 1) {
            q = q.startAfter(this.lastDocument);
          }
          return q;
        }
      );
  
      return query.snapshotChanges().pipe(
        map((actions) => {
          if (actions.length > 0) {
            this.lastDocument = actions[actions.length - 1].payload.doc;
          }
          return actions.map((a) => {
            const data = a.payload.doc.data() as Animal;
            const firestoreId = a.payload.doc.id;
            return { ...data, firestoreId };
          });
        })
      );
    });
  }

  getAllAnimals(): Observable<Animal[]> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection<Animal>(this.animalsCollection)
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Animal;
              const firestoreId = a.payload.doc.id;
              return { ...data, firestoreId };
            })
          )
        )
    );
  }

  getAnimalById(animalId: string): Observable<Animal> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.animalsCollection).doc<Animal>(animalId)
        .snapshotChanges()
        .pipe(
          map((a) => {
            const data = a.payload.data() as Animal;
            const animalId = a.payload.id;
            return { ...data, animalId };
          })
        )
    );
  }

  async doesAnimalIdExist(animalId: string): Promise<boolean> {
    try {
      const querySnapshot = await firstValueFrom(
        runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.animalsCollection, (ref) =>
            ref.where('id', '==', animalId)
          ).get()
        )
      );
      return querySnapshot && !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking Animal ID:', error);
      return false;
    }
  }

  getDeceasedAnimalsCount(): Observable<number> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection('deceasedAnimals')
        .snapshotChanges()
        .pipe(map((actions) => actions.length))
    );
  }

  getDeceasedAnimals(): Observable<any[]> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.deceasedName).valueChanges()
    );
  }

  resetPagination(): void {
    this.lastDocument = null;
  }
}
