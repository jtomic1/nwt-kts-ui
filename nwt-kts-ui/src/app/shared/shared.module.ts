import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './services/message-service/message.service';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatButtonComponent } from './components/chat-button/chat-button.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, MessageComponent, PersonalDataComponent, ChatButtonComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [MaterialModule, NavbarComponent, PersonalDataComponent,ChatButtonComponent],
})
export class SharedModule {}
