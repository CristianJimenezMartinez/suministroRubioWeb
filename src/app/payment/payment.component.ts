import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, CreatePaymentMethodCardData } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, NgxStripeModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass'],
  standalone: true
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  // Se reciben los productos del carrito para uso informativo o para enviarlos al backend
  @Input() cartItems: any[] = [];

  @Output() paymentConfirmed = new EventEmitter<any>();  // Emitirá la información del PaymentMethod y del carrito
  @Output() paymentError = new EventEmitter<string>();     // Emitirá un mensaje de error
  @Output() cancel = new EventEmitter<void>();

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#000000',
        color: '#000000',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#aab7c4'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  errorMessage: string = '';
  processing: boolean = false;

  constructor(private stripeService: StripeService) {}

  ngOnInit(): void {
    console.log('Productos recibidos en PaymentComponent:', this.cartItems);
  }

  // Método para procesar el pago
  pay(): void {
    this.processing = true;
    const paymentData = {
      type: 'card',
      card: this.card.element,
      billing_details: {
        name: 'Customer Name'  // En un flujo real se usarían los datos del checkout
      }
    } as CreatePaymentMethodCardData;

    console.log('Procesando pago con los siguientes productos:', this.cartItems);

    this.stripeService.createPaymentMethod(paymentData).subscribe(result => {
      this.processing = false;
      if (result.error) {
        this.errorMessage = result.error.message || 'Error al procesar el pago';
        console.error('Error al crear PaymentMethod:', result.error);
        // Emitir el error para que el componente padre lo maneje y muestre el popup (sin borrar el carrito)
        this.paymentError.emit(this.errorMessage);
      } else {
        console.log('PaymentMethod creado:', result.paymentMethod);
        // Emitir el éxito junto con el PaymentMethod y la información del carrito
        this.paymentConfirmed.emit({
          paymentMethod: result.paymentMethod,
          cartItems: this.cartItems
        });
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
