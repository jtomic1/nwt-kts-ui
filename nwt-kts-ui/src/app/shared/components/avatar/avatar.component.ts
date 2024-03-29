import { Component, Input } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { getAvatarClass } from '../../models/enums/Role';
import { User } from '../../models/User';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent  {
  @Input() placeholder: string | null = null;
  @Input() width: string = '150px';
  @Input() height: string = '150px';

  constructor(private loginService: LoginService) {}

  

  get user(): User {
    return this.loginService.user!;
  }

  get photo(): string {
    if (this.placeholder !== null) return this.placeholder;
    return this.user.profilePhoto;
  }

  get roleClass(): string {
    if (this.placeholder !== null) return 'shadow-gray';
    return getAvatarClass(this.user.role);
  }
}
