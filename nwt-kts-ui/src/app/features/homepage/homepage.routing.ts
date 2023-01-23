import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverChangeListComponent } from './components/driver-change/driver-change-list/driver-change-list.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'editProfile', component: EditProfileComponent },
  { path: 'addDriver', component: RegisterDriverComponent },
  { path: 'driverChangeRequests', component: DriverChangeListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomepageRoutingModule {}
