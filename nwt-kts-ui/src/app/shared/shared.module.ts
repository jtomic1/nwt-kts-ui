import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './services/message-service/message.service';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavbarComponent, MessageComponent, PersonalDataComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  exports: [MaterialModule, NavbarComponent, PersonalDataComponent],
})
export class SharedModule {}
