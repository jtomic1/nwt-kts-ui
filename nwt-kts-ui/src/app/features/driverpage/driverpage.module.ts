import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverHomepageComponent } from './components/driver-homepage/driver-homepage.component';
import { NewRideDriverDialogComponent } from './components/dialogs/new-ride-driver-dialog/new-ride-driver-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InRideDriverDialogComponent } from './components/dialogs/in-ride-driver-dialog/in-ride-driver-dialog.component';
import { MaterialModule } from 'src/app/shared/material/material/material.module';



@NgModule({
  declarations: [
    DriverHomepageComponent,
    NewRideDriverDialogComponent,
    InRideDriverDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class DriverpageModule { }
