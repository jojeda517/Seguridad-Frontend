import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"proyecto-seguridad-30035","appId":"1:1017306172688:web:304bcbbc60879f2f54e995","storageBucket":"proyecto-seguridad-30035.appspot.com","apiKey":"AIzaSyBw75xSdh1_Hth9z9d4GvkvjtewVm6E5V4","authDomain":"proyecto-seguridad-30035.firebaseapp.com","messagingSenderId":"1017306172688"})),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
