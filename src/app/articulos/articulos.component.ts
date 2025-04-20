import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { LoadingComponent } from '../loading/loading.component';
import { RatesService } from '../services/rates.service';

export interface Article {
  codart: string;
  desart: string;
  dewart?: string;
  pcoart: string; // Precio base, que se sobrescribe con el precio calculado
  imgart: string;
  famart: string;
  eanart: string;
  measure?: string;
  tivart?: string; // "0" para IVA del 21% o "1" para IVA del 10%
}

@Component({
  selector: 'app-articulos',
  imports: [HttpClientModule, CommonModule, LoadingComponent],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.sass'],
  standalone: true
})
export class ArticulosComponent implements OnInit {
  apiService = inject(DataService);
  cartService = inject(CartService);
  ratesService = inject(RatesService);

  articles: Article[] = [];
  measures: string[] = [];
  errorMessage: string = '';

  // Agrupación original de artículos
  groupedArticles: { [key: string]: Article[] } = {};
  // Agrupación que se mostrará (después de filtrar)
  filteredGroupedArticles: { [key: string]: Article[] } = {};

  // Variante seleccionada por cada grupo
  selectedVariants: { [key: string]: Article } = {};

  // Tipos disponibles para filtrar (primeras palabras sin duplicados)
  availableTypes: string[] = [];

  // Paginación (al estilo de categorías)
  pageSize: number = 12;
  displayedCount: number = 12;

  // Indicadores de carga y modo búsqueda
  isLoading: boolean = true;
  isSearchMode: boolean = false;

  // Propiedades para el filtro integrado
  isFilterOpen: boolean = true;
  selectedFilterTypes: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      if (query) {
        // Modo búsqueda
        this.isSearchMode = true;
        this.apiService.getMeasures().subscribe({
          next: (res) => {
            this.measures = (res.measures || [])
              .map((m: any) => m.desume)
              .filter((s: string) => s && s.trim() !== '');
            this.apiService.searchArticles(query).subscribe({
              next: (data: Article[]) => {
                data.forEach(article => {
                  if (article.imgart) {
                    let fixedPath = article.imgart.replace(/\\/g, '/');
                    const index = fixedPath.indexOf('/FOTOS/');
                    if (index !== -1) {
                      const relativePath = fixedPath.substr(index);
                      article.imgart = 'assets/img/factusolImg' + relativePath;
                    }
                  }
                  if (article.dewart) {
                    article.desart = article.dewart;
                  }
                  article.desart = article.desart
                    .replace(/\\/g, '')
                    .replace(/\n/g, ' ')
                    .trim();
                  const { truncatedName, foundMeasure } = extractMeasureFromDesart(article.desart, this.measures);
                  article.desart = truncatedName;
                  if (foundMeasure) {
                    article.measure = foundMeasure;
                  }
                });
                this.articles = data;
                this.ratesService.getInternetRate().subscribe({
                  next: (internetRate) => {
                    this.articles.forEach(article => {
                      const basePrice = parseFloat(article.pcoart);
                      const computedPrice = this.ratesService.calculateRealPrice(basePrice, internetRate);
                      let vatPercentage = 21;
                      if (article.tivart === '1') {
                        vatPercentage = 10;
                      }
                      const finalPrice = computedPrice * (1 + vatPercentage / 100);
                      article.pcoart = finalPrice.toFixed(2);
                    });
                    this.groupArticlesAndSetup();
                  },
                  error: (err) => {
                    this.errorMessage = 'Error al obtener la tarifa de INTERNET';
                    this.isLoading = false;
                  }
                });
              },
              error: err => {
                this.errorMessage = 'Error al realizar la búsqueda';
                this.isLoading = false;
              }
            });
          },
          error: err => {
            this.errorMessage = 'Error al cargar las medidas';
            this.isLoading = false;
          }
        });
      } else {
        const famParam = this.route.snapshot.paramMap.get('fam');
        if (famParam) {
          // Modo por familia
          this.apiService.getMeasures().subscribe({
            next: (res) => {
              this.measures = (res.measures || [])
                .map((m: any) => m.desume)
                .filter((s: string) => s && s.trim() !== '');
              this.apiService.getArticlesByFamily(famParam).subscribe({
                next: (data: Article[]) => {
                  data.forEach(article => {
                    if (article.imgart) {
                      let fixedPath = article.imgart.replace(/\\/g, '/');
                      const index = fixedPath.indexOf('/FOTOS/');
                      if (index !== -1) {
                        const relativePath = fixedPath.substr(index);
                        article.imgart = 'assets/img/factusolImg' + relativePath;
                      }
                    }
                    if (article.dewart) {
                      article.desart = article.dewart;
                    }
                    article.desart = article.desart
                      .replace(/\\/g, '')
                      .replace(/\n/g, ' ')
                      .trim();
                    const { truncatedName, foundMeasure } = extractMeasureFromDesart(article.desart, this.measures);
                    article.desart = truncatedName;
                    if (foundMeasure) {
                      article.measure = foundMeasure;
                    }
                  });
                  this.articles = data;
                  this.ratesService.getInternetRate().subscribe({
                    next: (internetRate) => {
                      this.articles.forEach(article => {
                        const basePrice = parseFloat(article.pcoart);
                        const computedPrice = this.ratesService.calculateRealPrice(basePrice, internetRate);
                        let vatPercentage = 21;
                        if (article.tivart === '1') {
                          vatPercentage = 10;
                        }
                        const finalPrice = computedPrice * (1 + vatPercentage / 100);
                        article.pcoart = finalPrice.toFixed(2);
                      });
                      this.groupArticlesAndSetup();
                    },
                    error: (err) => {
                      this.errorMessage = 'Error al obtener la tarifa de INTERNET';
                      this.isLoading = false;
                    }
                  });
                },
                error: (err) => {
                  this.errorMessage = 'Error al cargar los artículos por familia';
                  this.isLoading = false;
                }
              });
            },
            error: (err) => {
              this.errorMessage = 'Error al cargar las medidas';
              this.isLoading = false;
            }
          });
        } else {
          // Cargar TODOS los artículos
          this.apiService.getArticles().subscribe({
            next: (result) => {
              this.measures = (result.measures || [])
                .map((m: any) => m.desume)
                .filter((s: string) => s && s.trim() !== '');
              result.articles.forEach(article => {
                if (article.imgart) {
                  let fixedPath = article.imgart.replace(/\\/g, '/');
                  const index = fixedPath.indexOf('/FOTOS/');
                  if (index !== -1) {
                    const relativePath = fixedPath.substr(index);
                    article.imgart = 'assets/img/factusolImg' + relativePath;
                  }
                }
                if (article.dewart) {
                  article.desart = article.dewart;
                }
                article.desart = article.desart
                  .replace(/\\/g, '')
                  .replace(/\n/g, ' ')
                  .trim();
                const { truncatedName, foundMeasure } = extractMeasureFromDesart(article.desart, this.measures);
                article.desart = truncatedName;
                if (foundMeasure) {
                  article.measure = foundMeasure;
                }
              });
              this.articles = result.articles;
              this.ratesService.getInternetRate().subscribe({
                next: (internetRate) => {
                  this.articles.forEach(article => {
                    const basePrice = parseFloat(article.pcoart);
                    const computedPrice = this.ratesService.calculateRealPrice(basePrice, internetRate);
                    let vatPercentage = 21;
                    if (article.tivart === '1') {
                      vatPercentage = 10;
                    }
                    const finalPrice = computedPrice * (1 + vatPercentage / 100);
                    article.pcoart = finalPrice.toFixed(2);
                  });
                  this.groupArticlesAndSetup();
                },
                error: (err) => {
                  this.errorMessage = 'Error al obtener la tarifa de INTERNET';
                  this.isLoading = false;
                }
              });
            },
            error: (err) => {
              this.errorMessage = 'Error al cargar todos los artículos';
              this.isLoading = false;
            }
          });
        }
      }
    });
  }

  // Método para agrupar artículos y configurar variantes, paginación y filtros
  private groupArticlesAndSetup(): void {
    this.groupedArticles = this.groupArticles(this.articles);
    for (const key in this.groupedArticles) {
      if (this.groupedArticles.hasOwnProperty(key)) {
        this.selectedVariants[key] = this.groupedArticles[key][0];
      }
    }
    this.filteredGroupedArticles = { ...this.groupedArticles };
    this.availableTypes = this.extractArticleTypes(this.articles);
    // Paginación al estilo "Ver más": los artículos se mostrarán según displayedCount
    this.isLoading = false;
  }

  onFilterChanged(selectedTypes: string[]): void {
    if (selectedTypes.length === 0) {
      this.filteredGroupedArticles = { ...this.groupedArticles };
    } else {
      const filtered: { [key: string]: Article[] } = {};
      for (const key in this.groupedArticles) {
        if (this.groupedArticles.hasOwnProperty(key)) {
          const firstWord = key.split(' ')[0];
          if (selectedTypes.includes(firstWord)) {
            filtered[key] = this.groupedArticles[key];
          }
        }
      }
      this.filteredGroupedArticles = filtered;
    }
    // Reiniciar el contador de artículos mostrados al filtrar
    this.displayedCount = this.pageSize;
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      if (!this.selectedFilterTypes.includes(value)) {
        this.selectedFilterTypes.push(value);
      }
    } else {
      this.selectedFilterTypes = this.selectedFilterTypes.filter(type => type !== value);
    }
    this.onFilterChanged(this.selectedFilterTypes);
  }

  private groupArticles(articles: Article[]): { [key: string]: Article[] } {
    const groups: { [key: string]: Article[] } = {};
    articles.forEach(article => {
      const key = article.desart.trim();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(article);
    });
    return groups;
  }

  private extractArticleTypes(articles: Article[]): string[] {
    const types = articles.map(article => {
      const text = article.desart.trim();
      return text.split(' ')[0];
    });
    return Array.from(new Set(types));
  }

  loadMore(): void {
    this.displayedCount += this.pageSize;
  }

  nextPage(): void {
    // Se eliminan o dejan en desuso si se usa loadMore
  }

  previousPage(): void {
    // Se eliminan o dejan en desuso si se usa loadMore
  }

  onVariantChange(groupKey: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idx = parseInt(target.value, 10);
    if (this.groupedArticles[groupKey] && idx >= 0 && idx < this.groupedArticles[groupKey].length) {
      this.selectedVariants[groupKey] = this.groupedArticles[groupKey][idx];
    }
  }

  addToCart(article: Article): void {
    const cartItem = {
      id: article.codart,
      name: article.dewart || article.desart,
      price: parseFloat(article.pcoart),
      quantity: 1,
      img: article.imgart
    };
    this.cartService.addItem(cartItem);
  }
}

function extractMeasureFromDesart(
  desart: string,
  measures: string[]
): { truncatedName: string, foundMeasure: string } {
  const sortedMeasures = [...measures].sort((a, b) => b.length - a.length);
  for (const measure of sortedMeasures) {
    const trimmedMeasure = measure.trim();
    if (trimmedMeasure && desart.includes(trimmedMeasure)) {
      const truncatedName = desart.replace(trimmedMeasure, '').trim();
      return { truncatedName, foundMeasure: trimmedMeasure };
    }
  }
  return { truncatedName: desart, foundMeasure: '' };
}
