import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../services/model/user.model';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService: AuthService = inject(AuthService);

  connectedUser: User = { email: this.authService.notConnected };

  location = inject(Location);

  constructor() {
    effect(() => {
      if (this.authService.fetchUser().status == 'OK') {
        this.connectedUser = this.authService.fetchUser().value!;
      }
    });
  }

  ngOnInit(): void {
    this.authService.fetch(true);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  goBackward(): void {
    this.location.back();
  }

  goForward(): void {
    this.location.forward();
  }
}
