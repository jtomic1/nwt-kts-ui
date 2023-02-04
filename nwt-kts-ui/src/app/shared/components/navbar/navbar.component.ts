import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { Role } from '../../models/enums/Role';
import { User } from '../../models/User';
import { TokensService } from '../../services/tokens-service/tokens.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  logoutIcon = faRightFromBracket;

  user:  User | undefined;
  driverRole = Role.DRIVER;
  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginService.userChanged.subscribe((user) => {
      this.user = user;
    });
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigateByUrl('login');
  }
}
