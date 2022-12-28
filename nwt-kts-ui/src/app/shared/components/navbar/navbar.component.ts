import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username?:string;

  constructor(
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.userChanged.subscribe(
      (user)=>{
        this.username = user.email;
      }
    )
  }

}
