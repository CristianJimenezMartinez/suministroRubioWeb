import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FamilyService, Family } from '../services/family.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.sass'],
  standalone: true
})
export class CategoriaComponent implements OnInit {
  families: Family[] = [];
  filteredFamilies: Family[] = [];
  errorMessage: string = '';
  
  // Cantidad de familias a mostrar inicialmente y en cada "ver más"
  pageSize: number = 20;
  displayedCount: number = 20;
  
  isLoading: boolean = true;
  
  // Propiedades para el filtro
  isFilterOpen: boolean = true;
  availableTypes: string[] = [];       // Se almacenarán las primeras palabras únicas
  selectedFilterTypes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    const secParam = this.route.snapshot.paramMap.get('sec');
    if (secParam) {
      // Se proporcionaron IDs de secciones, se cargan familias filtradas por secciones
      this.familyService.getFamiliesBySections(secParam).subscribe({
        next: (families: Family[]) => {
          this.families = families;
          this.initializeFilter();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error al obtener familias por secciones:', err);
          this.errorMessage = 'Error al cargar las familias';
          this.isLoading = false;
        }
      });
    } else {
      // No se proporcionaron IDs de secciones, se cargan TODAS las familias
      this.familyService.getFamily().subscribe({
        next: (families: Family[]) => {
          this.families = families;
          this.initializeFilter();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error al obtener todas las familias:', err);
          this.errorMessage = 'Error al cargar las familias';
          this.isLoading = false;
        }
      });
    }
  }
  
  // Extrae la primera palabra de cada desfam y elimina duplicados
  private initializeFilter(): void {
    const types = this.families.map(family => {
      const firstWord = family.desfam.trim().split(' ')[0];
      return firstWord;
    });
    this.availableTypes = Array.from(new Set(types));
    // Inicialmente sin filtro, se muestran todas las familias
    this.filteredFamilies = [...this.families];
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
  
  onFilterChanged(selectedTypes: string[]): void {
    if (selectedTypes.length === 0) {
      this.filteredFamilies = [...this.families];
    } else {
      this.filteredFamilies = this.families.filter(family => {
        const firstWord = family.desfam.trim().split(' ')[0];
        return selectedTypes.includes(firstWord);
      });
    }
    // Reinicia el contador de familias mostradas al filtrar
    this.displayedCount = this.pageSize;
  }
  
  loadMore(): void {
    // Incrementa la cantidad de familias mostradas
    this.displayedCount += this.pageSize;
  }
  
  goToArticles(familyId: string): void {
    // Navega al componente de artículos pasando el ID de familia
    this.router.navigate(['/articulos', familyId]);
  }
}
