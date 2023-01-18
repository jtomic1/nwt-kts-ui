import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientpageMapComponent } from './features/clientpage/components/clientpage-map/clientpage-map.component';
import { ContainerSidenavComponent } from './features/homepage/components/container-sidenav/container-sidenav.component';
import { ResetPasswordComponent } from './features/startpage/components/reset-password/reset-password.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: StartpageTabContainerComponent },
  { path: 'login/:status', component: StartpageTabContainerComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: ContainerSidenavComponent },
  //*************//
  { path: 'clientmap', component: ClientpageMapComponent },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
