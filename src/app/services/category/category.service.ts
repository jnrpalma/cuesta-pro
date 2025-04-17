import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id?: string;
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private injector: Injector = inject(Injector);
  private readonly collectionName = 'categories';

  constructor(private firestore: AngularFirestore) {}

  /** Obtém todas as categorias */
  getCategories(): Observable<Category[]> {
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection<Category>(this.collectionName)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data() as Category;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        )
    );
  }

  /** Adiciona uma nova categoria */
  addCategory(category: Category): Promise<void> {
    const id = this.firestore.createId();
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection(this.collectionName)
        .doc(id)
        .set({ ...category, id })
    );
  }

  /** Verifica existência via campo "value" */
  categoryExists(value: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () =>
      this.firestore
        .collection<Category>(
          this.collectionName,
          ref => ref.where('value', '==', value)
        )
        .snapshotChanges()
        .pipe(map(actions => actions.length > 0))
    );
  }

  /** Remove uma categoria (batched delete) */
  async removeCategory(value: string): Promise<void> {
    const snapshot = await runInInjectionContext(this.injector, () =>
      this.firestore
        .collection<Category>(
          this.collectionName,
          ref => ref.where('value', '==', value)
        )
        .get()
        .toPromise()
    );
  
    if (!snapshot || snapshot.empty) {
      throw new Error('Categoria não encontrada.');
    }
  
    const batch = this.firestore.firestore.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
  
}
