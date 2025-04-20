// home.component.ts (fragmento relevante)
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Section
 {
  id: number;
  name: string;
  image: string;
  sec: string[]; // Por ejemplo, [1,3,5]
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class HomeComponent {
  
  // Mock de categorías
  sections: Section[] = [
    { id: 1, name: "Agua", image: "assets/img/agua.png", sec: ["1","2","3","5","11","21","32"] },
    { id: 2, name: "Energia", image: "assets/img/energia.png", sec: [ "REN"] },
    { id: 3, name: "Motores Y Motobombas", image: "assets/img/motores.png", sec: ["30"] },
    { id: 4, name: "Jardineria Y Ferreteria", image: "assets/img/jardineria.png", sec: ["31","10","18"] },
    { id: 5, name: "Climatización", image: "assets/img/climatizacion.png", sec: ["9", "36"] },
    { id: 6, name: "Electricidad Y Electronica", image: "assets/img/electronica.png", sec: ["ELC"] },
    { id: 7, name: "Outlet", image: "assets/img/outlet.png", sec: ["OFE"] },
    { id: 8, name: "Seguridad Y Comunicaciones", image: "assets/img/seguridad.png", sec: ["SEG"] }
  ];

  constructor(private router: Router) {}

  goToCategory(section: Section): void {
    // Convertimos el array de familias en una cadena separada por comas
    const secParam = section.sec.join(',');
    // Navegamos a /categoria/1,3,5 (por ejemplo)
    this.router.navigate(['/categorias', secParam]);
  }
}
