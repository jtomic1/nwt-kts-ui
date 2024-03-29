import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartpageTabContainerComponent } from './components/startpage-tab-container/startpage-tab-container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StartpageLoginComponent } from './components/startpage-login/startpage-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StartpageMapComponent } from './components/startpage-map/startpage-map.component';
import { StartpageRegisterComponent } from './components/startpage-register/startpage-register.component';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [StartpageTabContainerComponent, StartpageLoginComponent, StartpageMapComponent, StartpageRegisterComponent, ForgotPasswordDialogComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class StartpageModule {}
