import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerSidenavComponent } from './components/container-sidenav/container-sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HomepageRoutingModule } from './homepage.routing';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DriverChangeListComponent } from './components/driver-change/driver-change-list/driver-change-list.component';
import { FareHistoryComponent } from './components/fare-history/fare-history.component';
import { ClientFareDetailsComponent } from './components/client-fare-details/client-fare-details.component';

@NgModule({
  declarations: [
    ContainerSidenavComponent,
    EditProfileComponent,
    RegisterDriverComponent,
    DriverChangeListComponent,
    FareHistoryComponent,
    ClientFareDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HomepageRoutingModule,
  ],
  exports: [ContainerSidenavComponent],
})
export class HomepageModule {}
