import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  logoutIcon = faRightFromBracket;

  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout();
    this.router.navigateByUrl('login');
  }
}
