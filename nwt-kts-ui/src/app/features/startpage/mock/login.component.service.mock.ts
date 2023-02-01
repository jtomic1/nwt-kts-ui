import { delay, of, throwError } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import { LoginData } from '../models/LoginData';
import { LoginResponseData } from '../models/LoginResponseData';

export const res: LoginResponseData = {
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

export class LoginServiceMock {
  facebookFlag: boolean = false;

  sendLoginRequest(loginData: LoginData) {
    let authenticatedUser = {
      username: 'RealUser',
      password: 'RealPass',
    };

    if (
      loginData.username === authenticatedUser.username &&
      loginData.password === authenticatedUser.password
    )
      return true;
    else return false;
  }
}
