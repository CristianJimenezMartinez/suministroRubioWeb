import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface Section {
  codsec: string;
  dessec: string;
  image?: string;
  // Otros campos que devuelva el backend
}

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private baseUrl = environment.apiUrl; // Ajusta según corresponda

  constructor(private http: HttpClient) {}

  // Método para obtener las secciones filtradas por IDs
  getSectionsByIds(ids: string[]): Observable<Section[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const idsParam = ids.join(',');
    // Asegúrate de que en el backend la ruta sea compatible con query parameters (por ejemplo, GET /secction?ids=1,2,3)
    return this.http.get<Section[]>(`${this.baseUrl}/secction?ids=${idsParam}`, { headers });
  }
}
