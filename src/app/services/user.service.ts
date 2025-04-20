import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Define el endpoint para actualizar el usuario
  private updateUrl = environment.apiUrl + "/updateUser";

  constructor(private http: HttpClient) { }

  /**
   * updateUser: Envía una petición PUT al servidor para actualizar el perfil del usuario.
   * Se espera que el objeto "user" incluya el identificador (CODCLI) y los demás campos actualizados.
   */
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(this.updateUrl, user);
  }
}
