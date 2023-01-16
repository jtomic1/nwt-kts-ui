import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClientpageMapComponent } from './components/clientpage-map/clientpage-map.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RideRequestDialogComponent } from './components/clientpage-dialogs/ride-request-dialog/ride-request-dialog.component';



@NgModule({
  declarations: [
    ClientpageMapComponent,
    RideRequestDialogComponent
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
export class ClientpageModule { }
