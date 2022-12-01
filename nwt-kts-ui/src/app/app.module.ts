import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material/material.module';
import { StartpageModule } from './features/startpage/startpage.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LiveChatComponent } from './features/live-chat-client/live-chat.component';
import { FormsModule } from '@angular/forms';
import { LiveChatAdminComponent } from './features/live-chat-admin/live-chat-admin.component'; 

@NgModule({
  declarations: [AppComponent, LiveChatComponent, LiveChatAdminComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MaterialModule,
    StartpageModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
