import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './services/message-service/message-service.service';

@NgModule({
  declarations: [NavbarComponent, MessageComponent],
  imports: [CommonModule, MaterialModule, FontAwesomeModule],
  exports: [MaterialModule, NavbarComponent],
})
export class SharedModule {}
