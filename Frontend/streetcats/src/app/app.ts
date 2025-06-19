import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ThemeSwitch } from './_services/theme-switch/theme-switch';
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

  themeManager = inject(ThemeSwitch); // Inietto il servizio ThemeSwitch

  ngOnInit() {
    this.themeManager.initTheme();
  }

  toggleTheme() {
    this.themeManager.toggleTheme(); // Inverte il tema e salva la preferenza
  }

}
