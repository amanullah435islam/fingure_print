import { Component } from '@angular/core';
import { AuthService } from '../../core/auth-service';

// @Component({
//   selector: 'app-login',
//   imports: [],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })



import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // 🔥 MUST
  imports: [FormsModule], // 🔥 ngModel
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';

  constructor(private auth: AuthService) {}

  async onRegister() {
    await this.auth.register(this.email);
  }

  async onLogin() {
    const res = await this.auth.login(this.email);
    alert(res.message);
  }
}