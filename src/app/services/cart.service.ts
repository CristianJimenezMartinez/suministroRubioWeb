import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = []
  private itemsSubject = new BehaviorSubject<any[]>(this.items)

  // Retorna el array actual de items (no reactivo)
  getItems(): any[] {
    return this.items
  }

  // Retorna el observable para suscribirse a los cambios
  getItemsObservable() {
    return this.itemsSubject.asObservable()
  }

  addItem(item: any): void {
    const existing = this.items.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity || 1
    } else {
      this.items.push({ ...item, quantity: item.quantity || 1 })
    }
    this.itemsSubject.next(this.items)
  }

  removeItem(itemId: any): void {
    this.items = this.items.filter(item => item.id !== itemId)
    this.itemsSubject.next(this.items)
  }

  updateItemQuantity(itemId: any, quantity: number): void {
    const item = this.items.find(i => i.id === itemId)
    if (item) {
      item.quantity = Number(quantity)
    }
    this.itemsSubject.next(this.items)
  }

  clearCart(): void {
    this.items = []
    this.itemsSubject.next(this.items)
  }
}
