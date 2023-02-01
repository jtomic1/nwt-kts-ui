import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminRegistrationData } from 'src/app/features/homepage/models/AdminRegistrationData';
import {
  adminRegistrationDataMock_1,
  registrationDataMock_1,
} from '../../mock/registration.service.mock';
import { RegistrationData } from '../../models/RegistrationData';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpController: HttpTestingController;

  let url = 'http://localhost:8080/api/reg';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RegistrationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('registrationService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call sendRegistrationRequest and return RegistrationData', () => {
    let regData: RegistrationData = {
      email: 'test@mail.com',
      password: 'testpass',
      confirmPassword: 'testpass',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
    };

    service.sendRegistrationRequest(regData).subscribe((data) => {
      expect(data).toEqual(registrationDataMock_1);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/register`,
    });

    req.flush(registrationDataMock_1);
  });

  it('should call sendRegistrationRequest with used e-mail and return 422 Unprocessable Entity', () => {
    let regData: RegistrationData = {
      email: 'alreadyInUse@mail.com',
      password: 'testpass',
      confirmPassword: 'testpass',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
    };

    service.sendRegistrationRequest(regData).subscribe({
      next: () => {
        fail('Expected 422, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('E-mail je već upotrebljen!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/register`,
    });

    req.flush(
      { message: 'E-mail je već upotrebljen!' },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('should call sendRegistrationRequest with invalid data (different passwords) and return 422 Unprocessable Entity', () => {
    let regData: RegistrationData = {
      email: 'alreadyInUse@mail.com',
      password: 'testpass1',
      confirmPassword: 'testpass2',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
    };

    service.sendRegistrationRequest(regData).subscribe({
      next: () => {
        fail('Expected 422, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('Uneti podaci su neispravni!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/register`,
    });

    req.flush(
      { message: 'Uneti podaci su neispravni!' },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('should call sendAdminRegistrationRequest and return AdminRegistrationData', () => {
    let adminRegData: AdminRegistrationData = {
      email: 'test@mail.com',
      password: 'testpass',
      confirmPassword: 'testpass',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
      vehicleName: 'Opel Vectra',
      plateNumber: 'SO101XS',
      capacity: 8,
      vehicleType: 'BASIC',
    };

    service.sendAdminRegistrationRequest(adminRegData).subscribe((data) => {
      expect(data).toEqual(adminRegistrationDataMock_1);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/adminRegister`,
    });

    req.flush(adminRegistrationDataMock_1);
  });

  it('should call sendAdminRegistrationRequest with used e-mail and return 422 Unprocessable Entity', () => {
    let adminRegData: AdminRegistrationData = {
      email: 'alreadyInUse@mail.com',
      password: 'testpass',
      confirmPassword: 'testpass',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
      vehicleName: 'Opel Vectra',
      plateNumber: 'SO101XS',
      capacity: 8,
      vehicleType: 'BASIC',
    };

    service.sendAdminRegistrationRequest(adminRegData).subscribe({
      next: () => {
        fail('Expected 422, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('E-mail je već upotrebljen!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/adminRegister`,
    });

    req.flush(
      { message: 'E-mail je već upotrebljen!' },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('should call sendAdminRegistrationRequest with invalid data (different passwords) and return 422 Unprocessable Entity', () => {
    let adminRegData: AdminRegistrationData = {
      email: 'test@mail.com',
      password: 'testpass1',
      confirmPassword: 'testpass2',
      name: 'Test',
      lastName: 'User',
      town: 'Novi Sad',
      phoneNumber: '0603587458',
      vehicleName: 'Opel Vectra',
      plateNumber: 'SO101XS',
      capacity: 8,
      vehicleType: 'BASIC',
    };

    service.sendAdminRegistrationRequest(adminRegData).subscribe({
      next: () => {
        fail('Expected 422, but got response!');
      },
      error: (err) => {
        expect(err.error.message).toEqual('Uneti podaci su neispravni!');
      },
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/adminRegister`,
    });

    req.flush(
      { message: 'Uneti podaci su neispravni!' },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });
});
