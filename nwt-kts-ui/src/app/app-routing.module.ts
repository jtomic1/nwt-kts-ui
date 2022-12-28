import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientpageMapComponent } from './features/clientpage/components/clientpage-map/clientpage-map.component';
import { LiveChatAdminComponent } from './features/live-chat/components/live-chat-admin/live-chat-admin.component';
import { LiveChatClientComponent } from './features/live-chat/components/live-chat-client/live-chat-client.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';
import { AddNewTokensComponent } from './features/tokens/components/add-new-tokens/add-new-tokens.component';

const routes: Routes = [
  { path: '', component: StartpageTabContainerComponent },
  { path: 'liveChat', component: LiveChatClientComponent },
  { path: 'liveChatAdmin', component: LiveChatAdminComponent },
  { path: 'tokens',component:AddNewTokensComponent}

  //*************//
  { path: 'clientmap', component: ClientpageMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
