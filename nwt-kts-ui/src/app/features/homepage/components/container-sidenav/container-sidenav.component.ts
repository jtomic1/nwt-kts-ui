import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faClockRotateLeft,
  faHeart,
  faUserGear,
  faUserPen,
  faUserPlus,
  faUserSlash,
  faChartColumn,
  faMapLocationDot,
  faCoins,
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
    // this.loginService.userChanged.subscribe(
    //   (user)=>{
    //     if(user != null ){
    //       this.optionArray = this.getOptionArrayFromRole(user.role);
    //     }
    //   }
    // )
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
    let ride: DrawerOption = {
      name: 'Poruči vožnju',
      route: 'clientmap',
      icon: faMapLocationDot,
    };

    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let history: DrawerOption = {
      name: 'Istorija vožnji',
      route: 'fareHistory',
      icon: faClockRotateLeft,
    };

    let favourites: DrawerOption = {
      name: 'Omiljene vožnje',
      route: 'favourites',
      icon: faHeart,
    };
    let reports: DrawerOption = {
      name: 'Izveštaji',
      route: 'reports',
      icon: faChartColumn,
    };

    let tokens: DrawerOption = {
      name: 'Finansijska kartica',
      route: 'tokens',
      icon: faCoins,
    };

    return [ride, profile, history, favourites, reports, tokens];
  }

  getDriverOptions(): DrawerOption[] {
    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let history: DrawerOption = {
      name: 'Istorija vožnji',
      route: 'fareHistory',
      icon: faClockRotateLeft,
    };

    let reports: DrawerOption = {
      name: 'Izveštaji',
      route: 'reports',
      icon: faChartColumn,
    };

    return [profile, history, reports];
  }

  getAdminOptions(): DrawerOption[] {
    let profile: DrawerOption = {
      name: 'Podaci o profilu',
      route: 'editProfile',
      icon: faUserPen,
    };

    let history: DrawerOption = {
      name: 'Istorija vožnji',
      route: 'fareHistory',
      icon: faClockRotateLeft,
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

    let reports: DrawerOption = {
      name: 'Izveštaji',
      route: 'reports',
      icon: faChartColumn,
    };

    return [
      profile,
      history,
      addDriver,
      driverChangeRequests,
      blockUsers,
      reports,
    ];
  }

  closeSidenav(): void {
    this.drawerService.opened = false;
  }
}
