import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject, take, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user-service/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  totalItems: number = 0;
  pageSize: number = 2;

  @Input() userType: string = '';

  users: User[] = [];
  isLoaded: boolean = false;


  constructor(private userService: UserService) { }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.init();    
  }

  init() {
    switch(this.userType) {
      case 'clients':
        this.getClientsCount();
        this.getClientsPage(0);        
        break;
      case 'drivers':
        this.getDriversCount();
        this.getDriversPage(0);
        break;
      default:
        break;
    }
  }

  getClientsCount() {
    this.userService.getClientsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: number) => {
          this.totalItems = res;
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  getDriversCount() {
    this.userService.getDriversCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: number) => {
          this.totalItems = res;
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  getClientsPage(page: number) {
    this.userService.getClients(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.users = res;
          this.isLoaded = true;       
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  getDriversPage(page: number) {
    this.userService.getDrivers(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.users = res;
          this.isLoaded = true;       
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  onPageChange(event: PageEvent) {
    switch(this.userType) {
      case 'clients':
        this.getClientsPage(event.pageIndex);
        break;
      case 'drivers':
        this.getDriversPage(event.pageIndex);
        break;
      default:
        break;
    }
  }

  deleteUser(id: number) {    
    this.init();
  }
}
