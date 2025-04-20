import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `,
  styleUrls: ['./loading.component.sass'],
  encapsulation: ViewEncapsulation.None, // Agrega esto para testear
  standalone: true
})
export class LoadingComponent {}
