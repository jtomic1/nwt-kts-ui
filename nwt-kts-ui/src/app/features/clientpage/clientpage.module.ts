import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClientpageMapComponent } from './components/clientpage-map/clientpage-map.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RideRequestDialogComponent } from './components/clientpage-dialogs/ride-request-dialog/ride-request-dialog.component';
import { RidePaymentComponent } from './components/clientpage-dialogs/ride-payment/ride-payment.component';
import { ClientInRideComponent } from './components/client-in-ride/client-in-ride.component';
import { AngularMaterialTimepickerModule } from '@jfilgaira/angular-material-timepicker';



@NgModule({
  declarations: [
    ClientpageMapComponent,
    RideRequestDialogComponent,
    RidePaymentComponent,
    ClientInRideComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
    AngularMaterialTimepickerModule,
    FormsModule
  ]
})
export class ClientpageModule { }
