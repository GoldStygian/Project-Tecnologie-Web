import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../_services/auth-service/auth-service';
import { ThemeSwitch } from '../_services/theme-switch/theme-switch';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, Sidenav],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {

  authService = inject(AuthService);
  themeService = inject(ThemeSwitch);

  sidenavOpen = false;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  closeSidenav() {
    this.sidenavOpen = false;
  }

}