import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material/material.module';
import { StartpageModule } from './features/startpage/startpage.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClientpageModule } from './features/clientpage/clientpage.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/interceptor/TokenInterceptor';
import { HomepageModule } from './features/homepage/homepage.module';
import {
  FacebookLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MaterialModule,
    SocialLoginModule,
    StartpageModule,
    HomepageModule,
    FontAwesomeModule,
    HttpClientModule,
    ClientpageModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1838879509798596'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
