import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [FormsModule,RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Guarda la respuesta (por ejemplo, token y datos del usuario)
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert('Error de autenticación');
      }
    });
  }
}
