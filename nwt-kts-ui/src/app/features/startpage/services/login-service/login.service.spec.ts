import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginData } from '../../models/LoginData';
import {
  mockLoginResponse3,
  mockLoginResponseGood,
  mockToken,
  mockUser,
} from '../../mock/login.service.mock';
import {
  SocialAuthService,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { DriverService } from 'src/app/shared/services/driver-service/driver.service';
import { SocialAuthMockService } from '../../mock/social-auth.service.mock';

describe('LoginService', () => {
  let service: LoginService;
  let httpController: HttpTestingController;
  let authService: SocialAuthService;
  let driverService: DriverService;

  let url = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SocialLoginModule],
      providers: [
        {
          provide: SocialAuthService,
          useClass: SocialAuthMockService,
        },
        DriverService,
      ],
    });
    service = TestBed.inject(LoginService);
    authService = TestBed.inject(SocialAuthService);
    driverService = TestBed.inject(DriverService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('loginService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change the value of the user', () => {
    service.setUserData(mockLoginResponse3);
    expect(JSON.stringify(service.user)).toEqual(JSON.stringify(mockUser));
  });

  it('should change the value of the token', () => {
    service.setUserData(mockLoginResponse3);
    expect(service.token).toEqual(mockToken);
  });

  it('should check that token is present', () => {
    service.setUserData(mockLoginResponse3);
    expect(service.isTokenPresent).toBeTrue();
  });

  it('should call sendLoginRequest and return token, expiresIn and user', () => {
    let loginData: LoginData = {
      username: 'TestUsername',
      password: 'TestPassword',
    };

    service.sendLoginRequest(loginData).subscribe((data) => {
      expect(data).toEqual(mockLoginResponseGood);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/login`,
    });

    req.flush(mockLoginResponseGood);
  });

  it('should call sendLoginRequest with wrong data, and handle 401 Unauthorized', () => {
    let loginData: LoginData = {
      username: 'invalid',
      password: 'invalid',
    };

    service.sendLoginRequest(loginData).subscribe({
      next: () => {
        fail('Expected 401, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('Neispravan e-mail ili lozinka!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/login`,
    });

    req.flush(
      { message: 'Neispravan e-mail ili lozinka!' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });

  it('should call sendLoginRequest for a non activated user, and handle 401 Unauthorized', () => {
    let loginData: LoginData = {
      username: 'inactive',
      password: 'TestPassword',
    };

    service.sendLoginRequest(loginData).subscribe({
      next: () => {
        fail('Expected 401, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('Nalog nije verifikovan!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/login`,
    });

    req.flush(
      { message: 'Nalog nije verifikovan!' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });

  it('should call sendLoginRequest for a blocked user, and handle 403 Forbidden', () => {
    let loginData: LoginData = {
      username: 'blockedTest',
      password: 'TestPassword',
    };

    service.sendLoginRequest(loginData).subscribe({
      next: () => {
        fail('Expected 403, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('Korisnik je blokiran!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/login`,
    });

    req.flush(
      { message: 'Korisnik je blokiran!' },
      { status: 403, statusText: 'Forbidden' }
    );
  });

  it('should call sendLoginWithFacebookRequest and return token, expiresIn and user', () => {
    service
      .sendLoginWithFacebookRequest({ email: 'test@mail.com' })
      .subscribe((data) => {
        expect(data).toEqual(mockLoginResponseGood);
      });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/facebookLogin`,
    });

    req.flush(mockLoginResponseGood);
  });

  it('should call sendLoginWithFacebookRequest for a non-existent mail, and handle 404 Not Found', () => {
    service
      .sendLoginWithFacebookRequest({ email: 'nonexistent@mail.com' })
      .subscribe({
        next: () => {
          fail('Expected 404, but got response!');
        },
        error: (err) => {
          expect(err.error.message).toEqual(
            'E-mail adresa nonexistent@mail.com nije registrovana. Neophodno je izvršiti registraciju pre prijave.'
          );
        },
      });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/facebookLogin`,
    });

    req.flush(
      {
        message:
          'E-mail adresa nonexistent@mail.com nije registrovana. Neophodno je izvršiti registraciju pre prijave.',
      },
      { status: 404, statusText: 'Not Found' }
    );
  });
});
