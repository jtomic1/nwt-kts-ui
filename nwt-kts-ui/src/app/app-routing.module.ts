import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveChatComponent } from './features/live-chat/live-chat.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', component: StartpageTabContainerComponent },
  { path: 'liveChat', component: LiveChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
