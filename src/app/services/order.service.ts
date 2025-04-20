import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;  // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  placeOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order)
  }
}
