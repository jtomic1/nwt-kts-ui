import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewTokensComponent } from './components/add-new-tokens/add-new-tokens.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';


@NgModule({
  declarations: [
    AddNewTokensComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule
  ]
})
export class TokensModule { }
