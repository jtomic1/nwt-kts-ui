import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveChatAdminComponent } from './features/live-chat-admin/live-chat-admin.component';
import { LiveChatComponent } from './features/live-chat-client/live-chat.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', component: StartpageTabContainerComponent },
  { path: 'liveChat', component: LiveChatComponent },
  { path: 'liveChatAdmin', component: LiveChatAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
