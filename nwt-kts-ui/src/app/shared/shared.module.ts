import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './services/message-service/message.service';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ChatButtonComponent } from './components/chat-button/chat-button.component';
import { BurgerMenuIconComponent } from './components/burger-menu-icon/burger-menu-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TokensCountComponent } from './components/tokens-count/tokens-count.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { MapComponent } from './components/map/map.component';
import { RideDataComponent } from './components/ride-data/ride-data.component';
import { NoteComponent } from './components/note/note.component';
import { DriverStatusComponent } from './components/driver-status/driver-status.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MessageComponent,
    PersonalDataComponent,
    ChatButtonComponent,
    TokensCountComponent,
    BurgerMenuIconComponent,
    AvatarComponent,
    MapComponent,
    RideDataComponent,
    NoteComponent,
    DriverStatusComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    MaterialModule,
    NavbarComponent,
    PersonalDataComponent,
    ChatButtonComponent,
    TokensCountComponent,
    AvatarComponent,
    MapComponent,
    RideDataComponent,
    NoteComponent
  ],
})
export class SharedModule {}
