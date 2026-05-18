import { Component } from '@angular/core';
import { AuthService } from '../../core/auth-service';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true, // 🔥 MUST
  imports: [FormsModule, RouterOutlet], // 🔥 ngModel
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    await this.auth.register(this.email);
    console.log("Registration successful, you can now log in.");
  }

  async onLogin() {
    const res = await this.auth.login(this.email);
    console.log("Login response:", res);

    if (res.success) {
      localStorage.setItem("token", res.token);
      this.router.navigate(['/dashboard']); // 🔥 MAIN LINE
    } else {
      alert("Login Failed");
    }
  }
}