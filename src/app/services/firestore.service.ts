import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  async saveGameResult(playerName: string, elapsedTime: number, dificultad :string) {
    const rawDate = new Date().toISOString();
    const formattedDate = rawDate.slice(0, 10); // Recorta la fecha para mostrar solo día, mes y año
    const gameResultsCollection = collection(this.firestore, 'gameResults');
    try {
      const docRef = await addDoc(gameResultsCollection, {
        playerName,
        elapsedTime,
        date: formattedDate,
        dificultad,
      });
      console.log('Documento guardado con ID: ', docRef.id);
    } catch (error) {
      console.error('Error al guardar el documento: ', error);
    }
  }

  public async getUserNameByUID(UIDUser: string)
  {
    const userCollection = collection(this.firestore, 'users');
    const userDoc = doc(userCollection, UIDUser);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData['perfil'];
    } 
    else 
    {
      console.log('Usuario no encontrado');
      return '';
    }
  }
  
  async getGameResults() {
    const gameResultsCollection = collection(this.firestore, 'gameResults');
    const querySnapshot = await getDocs(gameResultsCollection);

    const gameResults: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      gameResults.push(data);
    });

    return gameResults;
  }
}
