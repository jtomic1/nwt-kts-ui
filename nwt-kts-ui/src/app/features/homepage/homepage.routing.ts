import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from 'src/app/shared/components/report/report.component';
import { BlockingUsersComponent } from '../adminpage/components/blocking-users/blocking-users.component';
import { ClientpageMapComponent } from '../clientpage/components/clientpage-map/clientpage-map.component';
import { DriverHomepageComponent } from '../driverpage/components/driver-homepage/driver-homepage.component';
import { AddNewTokensComponent } from '../tokens/components/add-new-tokens/add-new-tokens.component';
import { DriverChangeListComponent } from './components/driver-change/driver-change-list/driver-change-list.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FareHistoryComponent } from './components/fare-history/fare-history.component';
import { FavouriteRidesComponent } from './components/favourite-rides/favourite-rides.component';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientmap' },
  { path: 'clientmap', component: ClientpageMapComponent },
  { path: 'editProfile', component: EditProfileComponent },
  { path: 'addDriver', component: RegisterDriverComponent },
  { path: 'driverChangeRequests', component: DriverChangeListComponent },
  { path: 'blocking', component: BlockingUsersComponent },
  { path: 'reports', component: ReportComponent },
  { path: 'fareHistory', component: FareHistoryComponent },
  { path: 'favourites', component: FavouriteRidesComponent },
  { path: 'tokens', component: AddNewTokensComponent },
  { path: 'driverHomePage', component: DriverHomepageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomepageRoutingModule {}
