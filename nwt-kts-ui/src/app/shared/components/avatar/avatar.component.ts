import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { getAvatarClass } from '../../models/enums/Role';
import { User } from '../../models/User';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  @Input() placeholder: string | null = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  get user(): User {
    return this.loginService.user!;
  }

  get photo(): string {
    if (this.placeholder !== null) return this.placeholder;
    return this.user.profilePhoto;
  }

  get roleClass(): string {
    if (this.placeholder !== null) return 'shadow-red';
    return getAvatarClass(this.user.role);
  }
}
