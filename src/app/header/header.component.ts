import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { DataService, Article } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, CartComponent, FormsModule, PopupComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  // Dropdown de navegación y perfil
  isNavDropdownOpen: boolean = false;
  isProfileDropdownOpen: boolean = false;

  // Variables de autenticación
  isLoggedIn: boolean = false;
  showLoginButton: boolean = true;
  showRegisterButton: boolean = true;

  // Determina si estamos en móvil (ancho <= 576px)
  isMobile: boolean = false;

  // Propiedades para el carrito
  isCartOpen: boolean = false;
  cartItemCount: number = 0;

  // Buscador
  searchText: string = '';
  filteredArticles: Article[] = [];

  constructor(
    private router: Router, 
    private elementRef: ElementRef,
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateIsMobile(window.innerWidth);

    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isLoggedIn = auth;
      if (auth) {
        // Si está autenticado, ocultamos los botones de login/registro
        this.showLoginButton = false;
        this.showRegisterButton = false;
      } else {
        this.showLoginButton = true;
        this.showRegisterButton = true;
      }
    });

    // Ajustar los botones según la ruta (si el usuario NO está autenticado)
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!this.isLoggedIn) {
          this.showLoginButton = !event.urlAfterRedirects.includes('/login');
          this.showRegisterButton = !event.urlAfterRedirects.includes('/register');
        }
      });

    // Actualizar el contador del carrito
    this.cartService.getItemsObservable().subscribe(items => {
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    this.updateIsMobile(target.innerWidth);
  }

  private updateIsMobile(width: number): void {
    this.isMobile = width <= 576;
  }

  toggleNavDropdown(): void {
    this.isNavDropdownOpen = !this.isNavDropdownOpen;
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
  }

  // Para móviles: redirige al login
  onMobileLoginClick(): void {
    this.router.navigate(['/login']); 
  }

  navigateTo(route: string): void {
    this.isNavDropdownOpen = false;
    this.router.navigate([route]);
  }

  // Lógica que venía del componente profile:
  navigateToProfile(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/settings']);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.authService.logout(); // Actualiza el observable de autenticación
    this.isLoggedIn = false;
    this.showLoginButton = true;
    this.showRegisterButton = true;
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/']);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  onSearch(): void {
    const query = this.searchText.trim();
    if (query) {
      this.router.navigate(['/articulos'], { queryParams: { query } });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isNavDropdownOpen = false;
      this.isProfileDropdownOpen = false;
      this.isCartOpen = false;
    }
  }
}
