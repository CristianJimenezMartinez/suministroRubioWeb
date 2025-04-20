// token.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recupera los datos del usuario desde localStorage (se asume que contienen el token)
    const userData = localStorage.getItem('user');
    if (userData) {
      const token = JSON.parse(userData).token;
      // Clona la solicitud y añade el header Authorization
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clonedReq);
    }
    // Si no hay token, envía la solicitud sin modificarla
    return next.handle(req);
  }
}
