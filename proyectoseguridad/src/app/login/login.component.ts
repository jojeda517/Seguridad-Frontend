import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  onClick(){
    this.loginService.loginWithMicrosoft()
    .then(response =>{
      console.log("Login Successful", response);
    }).catch(error => console.log(error))
  }

}
