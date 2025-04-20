import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service'; // O usa AuthService si lo prefieres
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./profile.component.sass'],
  standalone: true
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup; // Se usa "!" para indicar que se asignará más adelante
  loading: boolean = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Servicio encargado de actualizar datos
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con los campos que se desean actualizar
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      dni: [''],
      telf: [''],
      cp: [''],
      pob: [''],
      prov: [''],
      pais: [''],
      tdc: ['']
    });

    this.loadUserData();
  }

  loadUserData(): void {
    // Obtener el string del usuario desde localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      // Se parsea el JSON y se cargan los valores en el formulario.
      const user = JSON.parse(userJson);
      this.profileForm.patchValue({
        username: user.name,  // Se asume que "name" es el campo almacenado para el nombre
        surname: user.surname,
        email: user.email,
        address: user.address,
        dni: user.dni,
        telf: user.telf,
        cp: user.cp,
        pob: user.pob,
        prov: user.prov,
        pais: user.pais,
        tdc: user.tdc
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    this.loading = true;
    const updatedUser = this.profileForm.value;
    // Enviar la actualización al backend mediante el servicio
    this.userService.updateUser(updatedUser).subscribe({
      next: (res) => {
        this.message = 'Información actualizada correctamente';
        // Se actualiza localStorage si el backend retorna la información actualizada del usuario
        if (res && res.updatedUser) {
          localStorage.setItem('user', JSON.stringify(res.updatedUser));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.message = 'Error al actualizar, por favor intente de nuevo';
        this.loading = false;
      }
    });
  }
}
