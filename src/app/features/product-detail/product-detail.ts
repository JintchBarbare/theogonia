import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/models/product.model';

type StatKey = 'strength' | 'heroism' | 'wisdom';

interface StatDefinition {
  key: StatKey;
  label: string;
}

const MAX_STARS = 5;

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly maxStars = MAX_STARS;

  protected readonly statDefinitions: StatDefinition[] = [
    { key: 'strength', label: 'Strength' },
    { key: 'heroism', label: 'Heroism' },
    { key: 'wisdom', label: 'Wisdom' }
  ];

  protected readonly loading = signal(true);
  protected readonly character = signal<Product | null>(null);

  protected readonly inCartQty = computed(() => {
    const current = this.character();
    return current ? this.cartService.getQuantity(current.id) : 0;
  });

  protected readonly virtues = computed(() => {
    const current = this.character();
    if (!current) return [];

    return this.statDefinitions.map(({ key, label }) => {
      const value = current.stats?.[key] ?? 0;
      const filled = Math.min(Math.max(value, 0), MAX_STARS);
      return {
        key,
        label,
        value,
        stars: '★'.repeat(filled) + '☆'.repeat(MAX_STARS - filled)
      };
    });
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadCharacter(id);
      } else {
        this.character.set(null);
        this.loading.set(false);
      }
    });
  }

  protected addToPantheon(): void {
    const current = this.character();
    if (current) {
      this.cartService.addItem(current);
    }
  }

  protected increaseQty(): void {
    const current = this.character();
    if (current) {
      this.cartService.increment(current.id);
    }
  }

  protected decreaseQty(): void {
    const current = this.character();
    if (current) {
      this.cartService.decrement(current.id);
    }
  }

  private loadCharacter(id: string): void {
    this.loading.set(true);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.character.set(products.find((product) => product.id === id) ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.character.set(null);
        this.loading.set(false);
      }
    });
  }
}