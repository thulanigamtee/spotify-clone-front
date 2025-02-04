import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-popup',
  imports: [],
  templateUrl: './auth-popup.component.html',
  styleUrl: './auth-popup.component.scss',
})
export class AuthPopupComponent {
  private authService: AuthService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}
