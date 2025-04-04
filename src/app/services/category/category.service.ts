import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id?: string;
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private collectionName = 'categories';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtém todas as categorias do Firebase Firestore.
   * @returns Observable que emite um array de categorias.
   */
  getCategories(): Observable<Category[]> {
    return this.firestore.collection<Category>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  /**
   * Adiciona uma nova categoria ao Firebase Firestore.
   * @param category Categoria a ser adicionada.
   * @returns Promise que resolve quando a categoria é adicionada.
   */
  addCategory(category: Category): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...category, id });
  }

  /**
   * Verifica se uma categoria já existe no Firebase Firestore com base no valor.
   * @param value Valor da categoria a ser verificada.
   * @returns Observable que emite true se a categoria existir, false caso contrário.
   */
  categoryExists(value: string): Observable<boolean> {
    return this.firestore.collection<Category>(this.collectionName, ref => ref.where('value', '==', value)).snapshotChanges().pipe(
      map(actions => actions.length > 0)
    );
  }

   /**
   * Remove uma categoria do Firebase Firestore com base no valor.
   * @param value Valor da categoria a ser removida.
   * @returns Promise que resolve quando a categoria é removida.
   */
   removeCategory(value: string): Promise<void> {
    return this.firestore.collection(this.collectionName, ref => ref.where('value', '==', value))
      .get().toPromise().then(snapshot => {
        if (!snapshot || snapshot.empty) {
          return Promise.reject('Categoria não encontrada.');
        }

        const batch = this.firestore.firestore.batch(); 
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        return batch.commit(); 
      });
  }
}
