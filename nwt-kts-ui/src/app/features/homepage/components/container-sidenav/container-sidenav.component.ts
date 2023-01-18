import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { User } from 'src/app/shared/models/User';
import { DrawerService } from 'src/app/shared/services/drawer-service/drawer.service';

@Component({
  selector: 'app-container-sidenav',
  templateUrl: './container-sidenav.component.html',
  styleUrls: ['./container-sidenav.component.css'],
})
export class ContainerSidenavComponent implements OnInit {
  constructor(
    private drawerService: DrawerService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.drawerService.opened = false;
  }

  get opened(): boolean {
    return this.drawerService.opened;
  }

  get user(): User {
    return this.loginService.user!;
  }
}
