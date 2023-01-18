import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './services/message-service/message.service';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BurgerMenuIconComponent } from './components/burger-menu-icon/burger-menu-icon.component';

@NgModule({
  declarations: [NavbarComponent, MessageComponent, PersonalDataComponent, BurgerMenuIconComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [MaterialModule, NavbarComponent, PersonalDataComponent],
})
export class SharedModule {}
