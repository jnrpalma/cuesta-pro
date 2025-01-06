import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Animal } from "../../components/register-animal/interface/animal.interface";
import { VaccinationService } from "../vaccination/vaccination.service";

@Injectable({
  providedIn: "root",
})
export class AnimalService {
  private collectionName = "animals"; // Nome da coleção no Firestore
  private lastVisible: any = null; // Armazena o último documento visível para paginação

  constructor(
    private firestore: AngularFirestore,
    private vaccinationService: VaccinationService
  ) {}

  addAnimal(animal: Animal): Promise<void> {
    const firestoreId = this.firestore.createId();
    return this.firestore
      .collection(this.collectionName)
      .doc(firestoreId)
      .set({ firestoreId, ...animal });
  }

  updateAnimal(animal: Animal): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(animal.firestoreId)
      .update(animal);
  }

  // Exclui um animal pelo ID do Firestore (informar morte na tabela)
  animalDeath(firestoreId: string): Promise<void> {
    console.log(
      "Iniciando exclusão no serviço para o Firestore ID:",
      firestoreId
    );

    return this.firestore
      .collection(this.collectionName)
      .doc(firestoreId)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        if (docSnapshot && docSnapshot.exists) {
          console.log("Documento encontrado:", docSnapshot.data());
          const deceasedAnimal = docSnapshot.data(); // Recupera os dados do animal
          return this.firestore
            .collection("deceasedAnimals")
            .add(deceasedAnimal) // Salva na coleção de animais mortos
            .then((docRef) => {
              console.log(
                `Animal movido para deceasedAnimals com ID: ${docRef.id}`
              );
              return this.firestore
                .collection(this.collectionName)
                .doc(firestoreId)
                .delete(); // Exclui o animal da coleção original
            });
        } else {
          console.error("Animal não encontrado no Firestore.");
          throw new Error(
            "Animal não encontrado no Firestore ou o documento é undefined"
          );
        }
      })
      .then(() => {
        console.log(
          `Animal com Firestore ID ${firestoreId} foi excluído da coleção original.`
        );
        return this.vaccinationService.deleteVaccinationsByAnimalId(
          firestoreId
        ); // Remove vacinações correspondentes
      })
      .catch((error) => {
        console.error(
          `Erro ao processar o animal com Firestore ID ${firestoreId}:`,
          error
        );
        throw error;
      });
  }

  // Obtém uma lista de animais com suporte a paginação
  getAnimals(page: number, pageSize: number): Observable<Animal[]> {
    let query = this.firestore.collection<Animal>(
      this.collectionName,
      (ref) => {
        let q = ref.orderBy("id").limit(pageSize);
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
  }

  getAllAnimals(): Observable<Animal[]> {
    return this.firestore
      .collection<Animal>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Animal;
            const firestoreId = a.payload.doc.id;
            return { ...data, firestoreId };
          })
        )
      );
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.firestore
      .collection(this.collectionName)
      .doc<Animal>(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Animal;
          const firestoreId = a.payload.id;
          return { ...data, firestoreId };
        })
      );
  }

  checkAnimalIdExists(id: string): Promise<boolean> {
    return this.firestore
      .collection(this.collectionName, (ref) => ref.where("id", "==", id))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        // Verifica se querySnapshot é válido e não vazio
        if (querySnapshot && !querySnapshot.empty) {
          return true; // O ID já existe
        }
        return false; // O ID não existe
      })
      .catch((error) => {
        console.error("Erro ao verificar ID:", error);
        return false; // Retorna false em caso de erro
      });
  }

  getDeceasedAnimalsCount(): Observable<number> {
    return this.firestore
      .collection("deceasedAnimals")
      .snapshotChanges()
      .pipe(map((actions) => actions.length));
  }

  resetPagination() {
    this.lastVisible = null;
  }
}
