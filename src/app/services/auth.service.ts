import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from './model/state.model';
import { PathLocationStrategy } from '@angular/common';
import { User } from './model/user.model';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

export type AuthPopupState = 'OPEN' | 'CLOSE';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  locationStrategy = inject(PathLocationStrategy);
  location = inject(Location);

  auth0Service = inject(Auth0Service);

  notConnected = 'NOT_CONNECTED';

  accessToken: string | undefined;

  private fetchUser$: WritableSignal<State<User, HttpErrorResponse>> = signal(
    State.Builder<User, HttpErrorResponse>()
      .forSuccess({ email: this.notConnected })
      .build()
  );
  fetchUser = computed(() => this.fetchUser$());

  private triggerAuthPopup$: WritableSignal<AuthPopupState> = signal('CLOSE');
  authPopupStateChange = computed(() => this.triggerAuthPopup$());

  fetch(forceResync: any): void {
    this.http
      .get<User>(`${environment.API_URL}/api/get-authenticated-user`)
      .subscribe({
        next: (user) =>
          this.fetchUser$.set(
            State.Builder<User, HttpErrorResponse>().forSuccess(user).build()
          ),
        error: (err: HttpErrorResponse) => {
          if (
            err.status === HttpStatusCode.Unauthorized &&
            this.isAuthenticated()
          ) {
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>()
                .forSuccess({ email: this.notConnected })
                .build()
            );
          } else {
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>().forError(err).build()
            );
          }
        },
      });
  }

  isAuthenticated(): boolean {
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

  login(): void {
    location.href = `${location.origin}${this.location.prepareExternalUrl(
      'oauth2/authorization/okta'
    )}`;
  }

  // login(): void {
  //   this.auth0Service.loginWithRedirect();
  // }

  renewAccessToken() {
    this.auth0Service
      .getAccessTokenSilently({ cacheMode: 'off' })
      .subscribe((token: string) => {
        this.accessToken = token;
        this.fetch(true);
      });
  }

  // initAuthentication() {
  //   this.auth0Service.isAuthenticated$
  //     .pipe(
  //       filter((isLoggedIn) => isLoggedIn),
  //       switchMap(() => this.auth0Service.getAccessTokenSilently())
  //     )
  //     .subscribe((token: string) => {
  //       this.accessToken = token;
  //       this.fetch(false);
  //     });
  // }

  logout(): void {
    this.http
      .post(`${environment.API_URL}/api/logout`, {}, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.fetchUser$.set(
            State.Builder<User, HttpErrorResponse>()
              .forSuccess({ email: this.notConnected })
              .build()
          );
          location.href = response.logoutUrl;
        },
      });
  }

  // logout() {
  //   this.auth0Service.logout();
  // }

  openOrCloseAuthPopup(state: AuthPopupState) {
    this.triggerAuthPopup$.set(state);
  }
}
