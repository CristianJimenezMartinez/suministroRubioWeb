import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment'; // Ajusta la ruta según la ubicación

export interface Rate {
  codtar: string;
  destar: string;
  martar: string;
  ivatar: string;
  diitar: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  // Se construye la URL usando el environment.apiUrl definido
  private ratesUrl = `${environment.apiUrl}/rates`;

  constructor(private http: HttpClient) {}

  // Obtiene la lista de tarifas desde el endpoint
  getRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(this.ratesUrl);
  }

  // Extrae la tarifa cuyo destar es "INTERNET"
  getInternetRate(): Observable<Rate> {
    return this.getRates().pipe(
      map(rates => {
        const internetRate = rates.find(rate => rate.destar.toUpperCase() === 'INTERNET');
        if (!internetRate) {
          throw new Error('No se encontró la tarifa para INTERNET');
        }
        return internetRate;
      })
    );
  }

  // Calcula el precio real de un producto utilizando la tarifa "INTERNET"
  // Fórmula: precioReal = precioBase * (1 + (martar / 100))
  calculateRealPrice(basePrice: number, internetRate: Rate): number {
    const multiplier = parseFloat(internetRate.martar);
    return basePrice * (1 + multiplier / 100);
  }
}
