import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../_services/auth-service/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {

  authService = inject(AuthService);

  // isDark = false; // mantengo traccia del tema

  // ngOnInit() {
  //   const savedTheme = localStorage.getItem('theme'); // Carica la preferenza del tema dal localStorage
  //   if (savedTheme) {
  //     this.isDark = savedTheme === 'dark';
  //   } else {
  //     this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Se non c'è una preferenza salvata, usa il tema del sistema
  //   }
  //   this.applyTheme();
  // }

  // toggleTheme() {
  //   this.isDark = !this.isDark;
  //   this.applyTheme();
  //   localStorage.setItem('theme', this.isDark ? 'dark' : 'light'); // Salva la preferenza nel localStorage
  // }

  // private applyTheme() {
  //   const htmlEl = document.documentElement;
  //   const bodyEl = document.body;
    
  //   // Rimuovi entrambe le classi
  //   htmlEl.classList.remove('dark-theme', 'light-theme');
  //   bodyEl.classList.remove('dark-theme', 'light-theme');
    
  //   // Aggiungi la classe appropriata
  //   if (this.isDark) {
  //     htmlEl.classList.add('dark-theme');
  //     bodyEl.classList.add('dark-theme');
  //   } else {
  //     htmlEl.classList.add('light-theme');
  //     bodyEl.classList.add('light-theme');
  //   }
  // }


}
