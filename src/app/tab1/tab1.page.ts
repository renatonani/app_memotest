import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private router : Router, private afAuth : AuthService) {}

  asignarDificultad(dificultad :string){
    this.router.navigate(['/' + dificultad]);
  }

  logout()
  {
    this.afAuth.logOut();
    this.router.navigateByUrl("/login");
  }
}
