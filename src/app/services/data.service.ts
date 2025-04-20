import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

// Ajusta estas interfaces o importa las que ya tengas
export interface Article {
  codart: string;
  desart: string;
  dewart?: string;
  pcoart: string; // Precio base, que se sobrescribe con el precio calculado
  imgart: string;
  famart: string;
  eanart: string;
  measure?: string;
  tivart?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = environment.apiUrl; // Ajusta la URL según tu backend
  private readonly _http = inject(HttpClient);

  constructor(private http: HttpClient) { }

  // Método para obtener artículos + medidas (si tu backend lo soporta en la misma ruta)
  getArticles(): Observable<{ articles: Article[], measures: string[] }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<{ articles: Article[], measures: string[] }>(
      `${this.baseUrl}/articles`,
      { headers }
    );
  }

  // Método para obtener los artículos de una familia específica
  getArticlesByFamily(famId: string): Observable<Article[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Ajusta la ruta según tu backend, por ejemplo: GET /api/family/:famId
    return this.http.get<Article[]>(`${this.baseUrl}/family/${famId}`, { headers });
  }

  // Método para obtener solo las medidas
  getMeasures(): Observable<{ measures: string[] }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Ajusta la ruta si en tu backend la definiste diferente, por ejemplo /api/measures
    return this.http.get<{ measures: string[] }>(`${this.baseUrl}/measures`, { headers });
  }
  searchArticles(query: string): Observable<Article[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Article[]>(`${this.baseUrl}/articles/search?query=${query}`, { headers });
  }
  
}
