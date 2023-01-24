import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faUserGear,
  faUserPen,
  faUserPlus,
  faUserSlash,
  faChartColumn
} from '@fortawesome/free-solid-svg-icons';
import { DrawerOption } from 'src/app/features/startpage/models/DrawerOption';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { getAvatarClass, Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { DrawerService } from 'src/app/shared/services/drawer-service/drawer.service';

@Component({
  selector: 'app-container-sidenav',
  templateUrl: './container-sidenav.component.html',
  styleUrls: ['./container-sidenav.component.css'],
})
export class ContainerSidenavComponent implements OnInit {
  public optionArray: DrawerOption[] = [];

  constructor(
    private drawerService: DrawerService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.drawerService.opened = false;
    if (this.user == null) this.router.navigateByUrl('login');
    else this.optionArray = this.getOptionArrayFromRole(this.user.role);
  }

  get opened(): boolean {
    return this.drawerService.opened;
  }

  get user(): User | null {
    return this.loginService.user;
  }

  getOptionArrayFromRole(role: string): DrawerOption[] {
    if (role === Role.USER) return this.getUserOptions();
    else if (role === Role.DRIVER) return this.getDriverOptions();
    else if (role === Role.ADMIN) return this.getAdminOptions();

    return [];
  }

  getUserOptions(): DrawerOption[] {
    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let reports: DrawerOption = {
      name: 'Izveštaji',
      route: 'reports',
      icon: faChartColumn,
    };

    // MOCK
    let option2: DrawerOption = {
      name: 'Mock Option 2',
      route: 'mock',
      icon: faUserPen,
    };
    let option3: DrawerOption = {
      name: 'Mock Option 3',
      route: 'mock',
      icon: faUserPen,
    };
    let option4: DrawerOption = {
      name: 'Mock Option 4',
      route: 'mock',
      icon: faUserPen,
    };

    return [profile, reports, option2, option3, option4];
  }

  getDriverOptions(): DrawerOption[] {
    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let reports: DrawerOption = {
      name: 'Izveštaji',
      route: 'reports',
      icon: faChartColumn,
    }

    return [profile, reports];
  }

  getAdminOptions(): DrawerOption[] {
    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let addDriver: DrawerOption = {
      name: 'Registruj vozača',
      route: 'addDriver',
      icon: faUserPlus,
    };

    let driverChangeRequests: DrawerOption = {
      name: 'Zahtevi za izmenu vozača',
      route: 'driverChangeRequests',
      icon: faUserGear,
    };

    let blockUsers: DrawerOption = {
      name: 'Blokiraj vozače i korisnike',
      route: 'blocking',
      icon: faUserSlash,
    };

    return [profile, addDriver, driverChangeRequests, blockUsers];
  }

  closeSidenav(): void {
    this.drawerService.opened = false;
  }
}
