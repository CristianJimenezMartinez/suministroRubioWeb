import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment'; // Asegúrate de que la ruta sea la correcta

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private socket: Socket;
  
  // Reemplaza la URL con la de tu servidor
  private readonly SERVER_URL = environment.apiUrl;

  constructor() {
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      reconnection: true
    });
  }

  // Únete a una sala usando el orderId para recibir feedback solo para ese usuario/pedido
  joinRoom(orderId: string): void {
    this.socket.emit('joinRoom', orderId);
  }

  // Retorna un observable para suscribirse al evento "paymentFeedback"
  onPaymentFeedback(): Observable<any> {
    return new Observable((observer) => {
      const handler = (data: any) => {
        observer.next(data);
      };
      this.socket.on('paymentFeedback', handler);

      // Función de limpieza: se ejecuta al darse de baja del observable
      return () => {
        this.socket.off('paymentFeedback', handler);
      };
    });
  }

  // Desconecta el socket
  disconnect(): void {
    this.socket.disconnect();
  }
}
