import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface Family {
  codfam: string;
  desfam: string;
}

export interface Article {
  codart: string;
  desart: string;
  pcoart: string;
  imgart: string;
  famart: string;
  eanart: string;
}

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private baseUrl = environment.apiUrl; // Ajusta según corresponda

  constructor(private http: HttpClient) {
    console.log('FamilyService - baseUrl:', this.baseUrl);
   }

  // Endpoint para obtener la lista completa de familias
  getFamily(): Observable<Family[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Family[]>(`${this.baseUrl}/family`, { headers });
  }

  // Endpoint para obtener artículos de una familia
  getArticlesByFamily(id: number | string): Observable<Article[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Article[]>(`${this.baseUrl}/family/${id}`, { headers });
  }
  
  // Nuevo método para obtener familias por múltiples secciones.
  getFamiliesBySections(ids: string): Observable<Family[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Family[]>(`${this.baseUrl}/families/${ids}`, { headers });
  }
}
