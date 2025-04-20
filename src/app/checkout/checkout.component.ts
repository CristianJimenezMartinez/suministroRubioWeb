import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CheckoutComponent implements OnInit {
  // Recibe los artículos del carrito desde el componente padre
  @Input() cartItems: any[] = [];

  // Emite la información completa del checkout para pasar al siguiente paso (payment)
  @Output() checkoutCompleted = new EventEmitter<any>();
  // Emite para cancelar y volver al carrito
  @Output() cancelCheckout = new EventEmitter<void>();

  // Datos de envío
  shippingData = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  };

  // Método de envío seleccionado
  shippingMethod: string = 'standard';
  // Totales
  subtotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;

  ngOnInit(): void {
    this.calculateSubtotal();
    this.onShippingMethodChange();
  }

  // Calcula el subtotal sumando precio x cantidad de cada producto
  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Calcula el coste de envío según el método seleccionado
  calculateShippingCost(): void {
    if (this.shippingMethod === 'standard') {
      this.shippingCost = 5;
    } else if (this.shippingMethod === 'express') {
      this.shippingCost = 10;
    }
  }

  // Actualiza el total sumando subtotal y coste de envío
  updateTotal(): void {
    this.total = this.subtotal + this.shippingCost;
  }

  // Se llama cuando se cambia el método de envío
  onShippingMethodChange(): void {
    this.calculateShippingCost();
    this.updateTotal();
  }

  // Al enviar el formulario, se emite el evento checkoutCompleted con toda la información necesaria
  submitCheckout(): void {
    const checkoutInfo = {
      shippingData: this.shippingData,
      shippingMethod: this.shippingMethod,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      total: this.total,
      cartItems: this.cartItems
    };
    this.checkoutCompleted.emit(checkoutInfo);
  }

  // Permite cancelar el checkout y volver al carrito
  cancel(): void {
    this.cancelCheckout.emit();
  }
}
