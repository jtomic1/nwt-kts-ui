import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerSidenavComponent } from './components/container-sidenav/container-sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ContainerSidenavComponent],
  imports: [CommonModule, SharedModule, FontAwesomeModule],
  exports: [ContainerSidenavComponent],
})
export class HomepageModule {}
