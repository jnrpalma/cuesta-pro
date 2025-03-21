import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../components/register-animal/interface/animal.interface';
import { VaccinationService } from '../vaccination/vaccination.service';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private collectionName = 'animals';
  private lastVisible: any = null;
  // Obtenha o Injector usando a função inject() em vez de injetá-lo no construtor.
  private injector: Injector = inject(Injector);

  constructor(
    private firestore: AngularFirestore,
    private vaccinationService: VaccinationService
  ) {}

  addAnimal(animal: Animal): Promise<void> {
    const firestoreId = this.firestore.createId();
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).doc(firestoreId).set({ firestoreId, ...animal })
    );
  }

  updateAnimal(animal: Animal): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).doc(animal.firestoreId).update(animal)
    );
  }

  async animalDeath(firestoreId: string): Promise<void> {
    try {
      const docSnapshot = await firstValueFrom(
        runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.collectionName).doc(firestoreId).get()
        )
      );

      if (docSnapshot.exists) {
        const deceasedAnimal = docSnapshot.data();
        await runInInjectionContext(this.injector, () =>
          this.firestore.collection('deceasedAnimals').add(deceasedAnimal)
        );
        await runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.collectionName).doc(firestoreId).delete()
        );

        await this.vaccinationService.deleteVaccinationsByAnimalId(firestoreId);
        console.log(`Animal ${firestoreId} movido e excluído com sucesso.`);
      } else {
        console.error('Animal não encontrado no Firestore.');
        throw new Error('Animal não encontrado ou documento é undefined');
      }
    } catch (error) {
      console.error(`Erro ao processar o animal ${firestoreId}:`, error);
      throw error;
    }
  }

  getAnimals(page: number, pageSize: number): Observable<Animal[]> {
    return runInInjectionContext(this.injector, () => {
      let query = this.firestore.collection<Animal>(
        this.collectionName,
        (ref) => {
          let q = ref.orderBy('id').limit(pageSize);
          if (this.lastVisible && page > 1) {
            q = q.startAfter(this.lastVisible);
          }
          return q;
        }
      );

      return query.snapshotChanges().pipe(
        map((actions) => {
          if (actions.length > 0) {
            this.lastVisible = actions[actions.length - 1].payload.doc;
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
      this.firestore.collection<Animal>(this.collectionName)
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

  getAnimalById(id: string): Observable<Animal> {
    return runInInjectionContext(this.injector, () =>
      this.firestore.collection(this.collectionName).doc<Animal>(id)
        .snapshotChanges()
        .pipe(
          map((a) => {
            const data = a.payload.data() as Animal;
            const firestoreId = a.payload.id;
            return { ...data, firestoreId };
          })
        )
    );
  }

  async checkAnimalIdExists(id: string): Promise<boolean> {
    try {
      const querySnapshot = await firstValueFrom(
        runInInjectionContext(this.injector, () =>
          this.firestore.collection(this.collectionName, (ref) =>
            ref.where('id', '==', id)
          ).get()
        )
      );
      return querySnapshot && !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar ID:', error);
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

  resetPagination() {
    this.lastVisible = null;
  }
}
