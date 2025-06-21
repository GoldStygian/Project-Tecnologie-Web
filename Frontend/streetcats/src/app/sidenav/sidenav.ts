import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../_services/auth-service/auth-service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

  authService = inject(AuthService);
  @Input() isOpen = false;

  close() {
    this.isOpen = false;
  }
}
