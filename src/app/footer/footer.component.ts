import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
]
})

export class FooterComponent {
  
  constructor(private router: Router) {}

  currentYear: number = new Date().getFullYear();
}
