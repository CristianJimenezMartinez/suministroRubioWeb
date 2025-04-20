import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentComponent } from '../payment/payment.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { PopupComponent } from '../popup/popup.component';  // Asegúrate de la ruta correcta
import { FeedbackService } from '../services/feedback.service';
import { PaymentService } from '../services/payment.service'; // Importa el servicio de pago

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass'],
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentComponent, CheckoutComponent, PopupComponent]
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total: number = 0;
  // Variable para controlar la vista actual: 'cart', 'checkout', 'payment', 'confirmation'
  currentStep: string = 'cart';

  // Variables para el Popup
  popupMessage: string = '';
  showPopup: boolean = false;

  // Variable para almacenar los productos para el pago, que se actualizará en el checkout
  cartItemsForPayment: any[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private feedbackService: FeedbackService,
    private paymentService: PaymentService  // Inyección del servicio de pago
  ) {}

  ngOnInit(): void {
    this.loadCart();

    // Suscribirse al feedback en tiempo real del servidor vía Socket.IO
    this.feedbackService.onPaymentFeedback().subscribe((data) => {
      console.log('Received payment feedback:', data);
      if (data && data.message) {
        // Opcional: Verifica si el orderId coincide con el actual, si lo manejas
        this.popupMessage = data.message;
        this.showPopup = true;
      }
    });
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.id);
    this.loadCart();
  }

  updateQuantity(item: any, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateItemQuantity(item.id, quantity);
    this.loadCart();
  }

  continueCheckout(): void {
    this.onStepChange('checkout');
  }

  onStepChange(step: string): void {
    this.currentStep = step;
  }

  // Maneja el evento del checkout (cuando se completan los datos de envío, totales, etc.)
  handleCheckoutCompleted(checkoutData: any): void {
    console.log('Checkout completado:', checkoutData);
    // Asumimos que checkoutData.cartItems contiene los productos confirmados
    this.cartItemsForPayment = checkoutData.cartItems;
    // Si el checkout genera un orderId, únete a esa sala para recibir feedback (opcional)
    if (checkoutData.orderId) {
      this.feedbackService.joinRoom(checkoutData.orderId);
    }
    this.onStepChange('payment');
  }

  // Maneja el evento de pago exitoso y envía la orden al backend
  handlePaymentConfirmed(paymentData: any): void {
    console.log('Pago confirmado:', paymentData);

    // Construir el objeto "order" de forma dinámica usando los datos del carrito
    const order = {
      cabecera: {
        tippcl: 'O', // (ver comentario más abajo)
        codpcl: 0,
        refpcl: new Date().getTime(),
        fecpcl: new Date().toISOString().split('T')[0],
        agepcl: '',
        clipcl: '',
        dirpcl: '',
        tivpcl: '0',
        reqpcl: '0',
        almpcl: '',
        net1pcl: this.total  // Usar net1pcl en lugar de total
      }
      ,
      lineas: this.items.map((item, index) => ({
        tiplpc: '1',
        poslpc: index + 1,
        artlpc: item.id,
        deslpc: item.name,
        canlpc: item.quantity,
        dt1lpc: 0,
        prelpc: item.price,
        totlpc: item.price * item.quantity
      }))
    };

    console.log('Enviando orden al backend con PaymentMethod ID', paymentData.paymentMethod.id);
    console.log('Orden construida:', order);

    // Llamada al endpoint del backend para procesar la orden
    this.paymentService.processOrder(order, paymentData.paymentMethod.id)
      .subscribe({
        next: (response) => {
          console.log('Respuesta del backend (processOrder):', response);
          // Procesar respuesta exitosa: limpiar carrito, actualizar estado, etc.
          this.cartService.clearCart();
          this.currentStep = 'none';
          this.popupMessage = '¡Tu compra se ha realizado con éxito!';
          this.showPopup = true;
        },
        error: (err) => {
          console.error('Error al procesar la orden en el backend:', err);
          this.popupMessage = 'Error al procesar la orden. Revisa la consola.';
          this.showPopup = true;
        }
      });
  }
  
  // Maneja el evento de error en el pago
  handlePaymentError(errorMessage: string): void {
    console.error('Error en el pago:', errorMessage);
    // No borres el carrito en caso de error; simplemente muestra el popup con el mensaje de error
    this.popupMessage = `Error al procesar el pago: ${errorMessage}`;
    this.showPopup = true;
  }

  // Se llama cuando el usuario acepta el popup; en el caso de éxito, se podría cerrar el modal o redirigir
  closePopup(): void {
    this.showPopup = false;
    // Si el pago fue exitoso y ya se borró el carrito, podemos volver al estado 'cart' vacío o cerrar el popup
    if (this.currentStep === 'confirmation') {
      this.onStepChange('cart');
    }
  }

  closeCart(): void {
    this.close.emit();
  }
}
