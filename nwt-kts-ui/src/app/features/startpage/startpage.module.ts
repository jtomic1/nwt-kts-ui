import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartpageTabContainerComponent } from './components/startpage-tab-container/startpage-tab-container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StartpageLoginComponent } from './components/startpage-login/startpage-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StartpageMapComponent } from './components/startpage-map/startpage-map.component';

@NgModule({
  declarations: [StartpageTabContainerComponent, StartpageLoginComponent, StartpageMapComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class StartpageModule {}
