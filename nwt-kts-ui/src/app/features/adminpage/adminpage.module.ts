import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockingUsersComponent } from './components/blocking-users/blocking-users.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { ListUserComponent } from './components/list-user/list-user.component';
import { BlockingDialogComponent } from './components/adminpage-dialogs/blocking-dialog/blocking-dialog.component';


@NgModule({
  declarations: [
    BlockingUsersComponent,
    ListUsersComponent,
    ListUserComponent,
    BlockingDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
  ]
})
export class AdminpageModule { }
