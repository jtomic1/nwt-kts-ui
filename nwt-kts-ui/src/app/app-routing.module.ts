import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientpageMapComponent } from './features/clientpage/components/clientpage-map/clientpage-map.component';
import { DriverHomepageComponent } from './features/driverpage/components/driver-homepage/driver-homepage.component';
import { ContainerSidenavComponent } from './features/homepage/components/container-sidenav/container-sidenav.component';
import { ResetPasswordComponent } from './features/startpage/components/reset-password/reset-password.component';
import { LiveChatAdminComponent } from './features/live-chat/components/live-chat-admin/live-chat-admin.component';
import { LiveChatClientComponent } from './features/live-chat/components/live-chat-client/live-chat-client.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';
import { AddNewTokensComponent } from './features/tokens/components/add-new-tokens/add-new-tokens.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: StartpageTabContainerComponent },
  { path: 'login/:status', component: StartpageTabContainerComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: ContainerSidenavComponent },
  { path: 'liveChat', component: LiveChatClientComponent },
  { path: 'liveChatAdmin', component: LiveChatAdminComponent },
  { path: 'tokens',component:AddNewTokensComponent},
  { path: 'driverHomePage',component:DriverHomepageComponent},

  //*************//
  { path: 'clientmap', component: ClientpageMapComponent },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
