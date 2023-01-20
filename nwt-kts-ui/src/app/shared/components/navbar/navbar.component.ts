import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { Role } from '../../models/enums/Role';
import { User } from '../../models/User';
import { TokensService } from '../../services/tokens-service/tokens.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  driverRole = Role.DRIVER;
  constructor(
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.userChanged.subscribe(
      (user)=>{
        this.user = user;
      }
    )
  }

}
