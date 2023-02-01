import { Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { LoginResponseData } from '../models/LoginResponseData';

export const mockLoginResponseGood: LoginResponseData = {
  accessToken: 'abcde',
  expiresIn: 1600,
  user: {
    id: 1,
    active: true,
    blocked: false,
    email: 'test@mail.com',
    name: 'Test',
    lastName: 'User',
    phone: '1234567',
    username: 'test@mail.com',
    role: Role.USER,
    roleString: 'ROLE_USER',
    profilePhoto: 'http://www.testcloud.com/user_1',
    town: 'Novi Sad',
  },
};

export const mockFBLoginResponseGood: LoginResponseData = {
  accessToken: 'xyzwq',
  expiresIn: 3200,
  user: {
    id: 2,
    active: true,
    blocked: false,
    email: 'test@mail.com',
    name: 'Testko',
    lastName: 'Testkovic',
    phone: '9556565',
    username: 'test2@mail.com',
    role: Role.USER,
    roleString: 'ROLE_USER',
    profilePhoto: 'http://www.testcloud.com/user_2',
    town: 'Novi Sad',
  },
};

export const mockUser: User = {
  id: 3,
  active: true,
  blocked: false,
  email: 'test@mail.com',
  name: 'Testing',
  lastName: 'Testic',
  phone: '987564218',
  username: 'test3@mail.com',
  role: Role.USER,
  roleString: 'ROLE_USER',
  profilePhoto: 'http://www.testcloud.com/user_3',
  town: 'Beograd',
};

export const mockToken: string = 'po#23';

export const mockLoginResponse3: LoginResponseData = {
  accessToken: mockToken,
  expiresIn: 3200,
  user: mockUser,
};
