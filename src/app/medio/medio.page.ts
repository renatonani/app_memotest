import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-medio',
  templateUrl: './medio.page.html',
  styleUrls: ['./medio.page.scss'],
})
export class MedioPage {
  cards: any[] = [];
  selectedCardIndexes: number[] = [];
  isGameFinished = false;
  startTime: any;
  endTime: any;
  elapsedTime: number = 0; // Agregar una variable para el contador de tiempo
  isGameStarted = false;
  usuario: any;
  timerInterval: any = 0

  constructor(private auth: AuthService, private firestore: FirestoreService) {}

  async ngOnInit() {
    this.generateCards();
    const id = await this.auth.getUserUid() || "";
    this.usuario = await this.firestore.getUserNameByUID(id);
  }

  generateCards() {
    // Genera cartas aleatorias (pares de imágenes) con nombres de imagen idénticos
    const images = [
      'image1.jpg',
      'image1.jpg',
      'image2.jpg',
      'image2.jpg',
      'image3.jpg',
      'image3.jpg',
      'image4.jpg',
      'image4.jpg',
      'image5.jpg',
      'image5.jpg',
      // Agrega más nombres de imagen idénticos según sea necesario
    ];

    // Baraja las cartas
    this.cards = this.shuffleArray(images.map((image, index) => ({ id: index, image, isFlipped: false })));
  }

  shuffleArray(array: any[]) {
    // Algoritmo de Fisher-Yates para barajar el arreglo
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startGame() {
    this.isGameStarted = true; // Comienza el juego
    this.cards.forEach(card => (card.isFlipped = false));
    this.selectedCardIndexes = [];
    this.isGameFinished = false;
    this.startTime = Date.now();
    this.endTime = null;
    this.elapsedTime = 0; // Reiniciar el contador de tiempo
    this.cards = this.shuffleArray(this.cards);

    // Iniciar el contador de tiempo
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  cardClicked(index: number) {
    if (this.isGameStarted) {
      if (this.selectedCardIndexes.length < 2 && !this.isGameFinished && !this.cards[index].isFlipped) {
        this.cards[index].isFlipped = true;
        this.selectedCardIndexes.push(index);

        if (this.selectedCardIndexes.length === 2) {
          const [index1, index2] = this.selectedCardIndexes;
          // Comparar los identificadores
          if (this.cards[index1].image === this.cards[index2].image) {
            // Las cartas coinciden, déjalas boca arriba
          } else {
            // Las cartas no coinciden, gíralas nuevamente después de un breve retraso
            setTimeout(() => {
              this.cards[index1].isFlipped = false;
              this.cards[index2].isFlipped = false;
            }, 1000);
          }
          this.selectedCardIndexes = [];
          this.checkGameFinished();
        }
      }
    }
  }

  checkGameFinished() {
    // Verificar si todas las cartas se han descubierto
    const allFlipped = this.cards.every(card => card.isFlipped);
    if (allFlipped) {
      this.endTime = Date.now();
      this.isGameFinished = true;

      // Detener el contador de tiempo
      clearInterval(this.timerInterval);

      this.calculateElapsedTime();

      // Aquí puedes guardar el tiempo en la base de datos y realizar otras acciones
      this.firestore.saveGameResult(this.usuario, this.elapsedTime, "Media");
    }
  }

  calculateElapsedTime() {
    this.elapsedTime = Math.floor((this.endTime - this.startTime) / 1000); // en segundos
  }
}
