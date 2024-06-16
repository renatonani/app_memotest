import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.page.html',
  styleUrls: ['./top.page.scss'],
})
export class TopPage {
  topGameResults: any[] = [];

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    // Obtén todos los gameResults de la base de datos
    const gameResults = await this.firestoreService.getGameResults();

    // Ordena los gameResults por tiempo transcurrido de menor a mayor
    gameResults.sort((a, b) => a['elapsedTime'] - b['elapsedTime']);

    // Limita la lista a los mejores 5 resultados
    this.topGameResults = gameResults.slice(0, 5);
  }
}
