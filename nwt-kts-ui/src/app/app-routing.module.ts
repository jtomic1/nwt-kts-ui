import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerSidenavComponent } from './features/homepage/components/container-sidenav/container-sidenav.component';
import { ResetPasswordComponent } from './features/startpage/components/reset-password/reset-password.component';
import { LiveChatAdminComponent } from './features/live-chat/components/live-chat-admin/live-chat-admin.component';
import { LiveChatClientComponent } from './features/live-chat/components/live-chat-client/live-chat-client.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: StartpageTabContainerComponent },
  { path: 'login/:status', component: StartpageTabContainerComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },

  { path: 'liveChat', component: LiveChatClientComponent },
  { path: 'liveChatAdmin', component: LiveChatAdminComponent },

  //*************//
  {
    path: 'home',
    component: ContainerSidenavComponent,
    loadChildren: () =>
      import('./features/homepage/homepage.module').then(
        (m) => m.HomepageModule
      ),
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
