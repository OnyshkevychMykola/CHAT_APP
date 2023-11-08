import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import {lastValueFrom} from 'rxjs';
import { LoginResponseI } from 'src/app/model/login-response.interface';
import {UserI} from "../../../model/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar, private jwtService: JwtHelperService) { }

  async login(user: UserI) {
    try {
      const response = await lastValueFrom(this.http.post('api/users/login', user)) as LoginResponseI;
      localStorage.setItem('nestjs_chat_app', response.access_token);
      this.snackbar.open('Login Successful', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      });
      return response;
    } catch (error) {
      this.snackbar.open('An Error Happened', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      });
      throw error;
    }
  }

  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }
}
