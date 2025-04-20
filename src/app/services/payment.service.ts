import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Define el endpoint para procesar el pedido.
  // Se asume que environment.apiUrl ya está configurado (ej., http://tuservidor:puerto)
  private ordersUrl = `${environment.apiUrl}/orders`;

  // Endpoint para notificaciones de pago (opcional, normalmente es llamado por Stripe en webhook)
  private paymentUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  /**
   * Procesa el pedido enviando los datos de la orden y el PaymentMethod ID.
   * Se espera que el backend cree el PaymentIntent y maneje la orden.
   *
   * @param order Los datos de la orden (cabecera y líneas).
   * @param paymentMethodId El identificador del PaymentMethod obtenido en el frontend.
   * @returns Un Observable con la respuesta del backend.
   */
  processOrder(order: any, paymentMethodId: string): Observable<any> {
    const payload = { order, paymentMethodId };
    return this.http.post<any>(this.ordersUrl, payload);
  }

  /**
   * Método opcional para enviar notificaciones de pago al backend.
   * Generalmente, este endpoint es llamado por la pasarela de pago o un webhook, 
   * pero si en algún caso deseas probarlo desde el frontend, aquí está el método.
   *
   * @param notificationData Datos de notificación (por ejemplo, codfac, nuevoEstado, token).
   * @returns Un Observable con la respuesta del backend.
   */
  notifyPayment(notificationData: any): Observable<any> {
    return this.http.post<any>(this.paymentUrl, notificationData);
  }
}
