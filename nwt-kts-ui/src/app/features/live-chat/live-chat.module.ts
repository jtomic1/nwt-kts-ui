import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatHeadComponent } from './components/chat-head/chat-head.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';
import { LiveChatAdminComponent } from './components/live-chat-admin/live-chat-admin.component';
import { FormsModule } from '@angular/forms';
import { LiveChatClientComponent } from './components/live-chat-client/live-chat-client.component';
import { MaterialModule } from 'src/app/shared/material/material/material.module';


@NgModule({
  declarations: [
    LiveChatComponent,
    LiveChatAdminComponent,
    ChatHeadComponent,
    LiveChatClientComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class LiveChatModule { }
