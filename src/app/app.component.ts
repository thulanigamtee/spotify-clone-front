import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { HeaderComponent } from './components/layout/header/header.component';
import { LibraryComponent } from './components/layout/library/library.component';
import { NavigationComponent } from './components/layout/navigation/navigation.component';
import { NgbModal, NgbModalRef, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './services/toast.service';
import { AuthPopupState, AuthService } from './services/auth.service';
import { AuthPopupComponent } from './components/layout/auth-popup/auth-popup.component';
import { PlayerComponent } from './components/layout/player/player.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    HeaderComponent,
    LibraryComponent,
    NavigationComponent,
    NgbToast,
    PlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private faIconLibrary = inject(FaIconLibrary);

  toastService = inject(ToastService);

  private authService = inject(AuthService);

  private modalService = inject(NgbModal);

  private authModalRef: NgbModalRef | null = null;

  constructor() {
    effect(
      () => {
        this.openOrCloseAuthModal(this.authService.authPopupStateChange());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.initFontAwesome();
    // this.authService.initAuthentication();
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private openOrCloseAuthModal(state: AuthPopupState) {
    if (state === 'OPEN') {
      this.openAuthPopup();
    } else if (
      this.authModalRef !== null &&
      state === 'CLOSE' &&
      this.modalService.hasOpenModals()
    ) {
      this.authModalRef.close();
    }
  }

  private openAuthPopup() {
    this.authModalRef = this.modalService.open(AuthPopupComponent, {
      ariaDescribedBy: 'authentication-modal',
      centered: true,
    });

    this.authModalRef.dismissed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });

    this.authModalRef.closed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });
  }
}
