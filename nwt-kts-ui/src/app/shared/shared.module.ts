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
import { TokensCountComponent } from './components/tokens-count/tokens-count.component';
import { DriverStatusComponent } from './components/driver-status/driver-status.component';

@NgModule({
  declarations: [NavbarComponent, MessageComponent, PersonalDataComponent, ChatButtonComponent, TokensCountComponent, DriverStatusComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [MaterialModule, NavbarComponent, PersonalDataComponent,ChatButtonComponent,TokensCountComponent],
})
export class SharedModule {}
