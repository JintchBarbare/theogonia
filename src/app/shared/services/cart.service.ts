import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item';
import { Product } from '../../shared/models/product.model';

const STORAGE_KEY = 'theogony_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly items = signal<CartItem[]>(this.load());

  readonly totalCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    effect(() => {
      this.save(this.items());
    });
  }

  getQuantity(productId: string): number {
    return this.items().find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  addItem(product: Product): void {
    this.items.update((list) => {
      const existing = list.find((i) => i.product.id === product.id);
      if (existing) {
        return list.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...list, { product, quantity: 1 }];
    });
  }

  increment(productId: string): void {
    this.items.update((list) =>
      list.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  decrement(productId: string): void {
    this.items.update((list) =>
      list
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  removeItem(productId: string): void {
    this.items.update((list) => list.filter((i) => i.product.id !== productId));
  }

  clear(): void {
    this.items.set([]);
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(list: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
    }
  }
}