import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, OAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth:Auth) { }

  loginWithMicrosoft(){
    return signInWithPopup(this.auth, new OAuthProvider('microsoft.com'))
  }
}
