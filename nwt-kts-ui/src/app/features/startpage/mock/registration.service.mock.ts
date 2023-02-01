import { AdminRegistrationData } from '../../homepage/models/AdminRegistrationData';
import { RegistrationData } from '../models/RegistrationData';

export const registrationDataMock_1: RegistrationData = {
  email: 'test@mail.com',
  password: 'testpass',
  confirmPassword: 'testpass',
  name: 'Test',
  lastName: 'User',
  town: 'Novi Sad',
  phoneNumber: '0603587458',
};

export const adminRegistrationDataMock_1: AdminRegistrationData = {
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
