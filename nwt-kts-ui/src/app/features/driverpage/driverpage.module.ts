import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverHomepageComponent } from './components/driver-homepage/driver-homepage.component';
import { NewRideDriverDialogComponent } from './components/dialogs/new-ride-driver-dialog/new-ride-driver-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    DriverHomepageComponent,
    NewRideDriverDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class DriverpageModule { }
