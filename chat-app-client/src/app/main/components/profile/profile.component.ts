import { Component } from '@angular/core';
import { UserI } from '../../../model/user.interface';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: UserI = this.authService.getLoggedInUser();
  constructor(private chatService: ChatService, private authService: AuthService,
              private router: Router) { }

  logout() {
    localStorage.removeItem('nestjs_chat_app');
    this.router.navigateByUrl('/auth/login');
  }
}
