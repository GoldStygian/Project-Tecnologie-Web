import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
// import { FlashMessageComponent } from './flash-message/flash-message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'streetcats';

  isDark = false;

  ngOnInit() {
    // Carica la preferenza del tema dal localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      // Se non c'è una preferenza salvata, usa il tema del sistema
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    // Salva la preferenza nel localStorage
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  private applyTheme() {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    
    // Rimuovi entrambe le classi
    htmlEl.classList.remove('dark-theme', 'light-theme');
    bodyEl.classList.remove('dark-theme', 'light-theme');
    
    // Aggiungi la classe appropriata
    if (this.isDark) {
      htmlEl.classList.add('dark-theme');
      bodyEl.classList.add('dark-theme');
    } else {
      htmlEl.classList.add('light-theme');
      bodyEl.classList.add('light-theme');
    }
  }
}
