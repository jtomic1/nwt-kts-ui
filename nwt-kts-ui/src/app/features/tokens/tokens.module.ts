import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewTokensComponent } from './components/add-new-tokens/add-new-tokens.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokensCountComponent } from './components/tokens-count/tokens-count.component';



@NgModule({
  declarations: [
    AddNewTokensComponent,
    TokensCountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TokensModule { }
