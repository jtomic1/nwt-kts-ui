import { SocialUser } from '@abacritt/angularx-social-login';
import { Observable, of } from 'rxjs';

export class SocialAuthMockService {
  authState: Observable<SocialUser | null>;

  constructor() {
    this.authState = of(null);
  }
}
