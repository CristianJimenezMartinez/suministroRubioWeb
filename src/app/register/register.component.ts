// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule,LoadingComponent,PopupComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {
  user = {
    username: '',
    surname: '',
    email: '',
    address: '',
    dni: '',
    telf: '',
    cp: '',
    pob: '',
    prov: '',
    pais: '',
    tdc: '',
    password: ''
  };

  loading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  // Flag para determinar si tras aceptar se redirige (por registro exitoso) o se hace otra acción
  redirectOnAccept: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.loading) return;

    this.loading = true;
    // Hashea la contraseña antes de enviarla
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(this.user.password, saltRounds);

    // Prepara el payload con la contraseña hasheada
    const payload = {
      username: this.user.username,
      surname: this.user.surname,
      email: this.user.email,
      address: this.user.address,
      dni: this.user.dni,
      telf: this.user.telf,
      cp: this.user.cp,
      pob: this.user.pob,
      prov: this.user.prov,
      pais: this.user.pais,
      tdc: this.user.tdc,
      password: hashedPassword
    };

    console.log(payload);

    this.authService.register(payload).subscribe({
      next: () => {
        // Configura el mensaje y bandera para redirigir en el popup
        this.popupMessage = 'Usuario registrado correctamente';
        this.redirectOnAccept = true;
        this.showPopup = true;
        this.loading = false; // ya no se carga
      },
      error: (err) => {
        console.error('Error al registrar el usuario:', err);
        this.popupMessage = 'Hubo un error al registrar el usuario';
        this.redirectOnAccept = false; // en error, quizá no redirigir o lo rediriges a la misma página
        this.showPopup = true;
        this.loading = false; // deshabilita el spinner para permitir otra acción
      }
    });
  }

  // Función para manejar el clic en "Aceptar" del popup
  onPopupAccept() {
    this.showPopup = false;
    if (this.redirectOnAccept) {
      // Si se registró correctamente, redirige a login
      this.router.navigate(['/login']);
    }
    // En caso de error, simplemente se cierra el popup y se deja al usuario en el mismo formulario
  }
}
