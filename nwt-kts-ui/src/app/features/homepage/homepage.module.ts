import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerSidenavComponent } from './components/container-sidenav/container-sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HomepageRoutingModule } from './homepage.routing';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContainerSidenavComponent,
    EditProfileComponent,
    RegisterDriverComponent,
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
