import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { getAvatarClass } from '../../models/enums/Role';
import { User } from '../../models/User';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  get user(): User {
    return this.loginService.user!;
  }

  get roleClass(): string {
    return getAvatarClass(this.user.role);
  }
}
