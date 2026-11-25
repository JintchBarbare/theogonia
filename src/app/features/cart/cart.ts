import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/models/product.model';

type StatKey = 'strength' | 'heroism' | 'wisdom';

interface StatDefinition {
  key: StatKey;
  label: string;
  icon: string;
}

const MAX_STARS = 5;

const formatFigures = (count: number): string =>
  `${count} ${count === 1 ? 'figure' : 'figures'}`;

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  protected readonly cartService = inject(CartService);

  protected readonly statDefinitions: StatDefinition[] = [
    { key: 'strength', label: 'Strength', icon: '⚔' },
    { key: 'heroism', label: 'Heroism', icon: '🛡' },
    { key: 'wisdom', label: 'Wisdom', icon: '🪶' }
  ];

  protected readonly dispatchSuccessMessage = signal<string | null>(null);

  protected readonly figuresLabel = computed(() => formatFigures(this.cartService.totalCount()));
  protected readonly maxStatPossible = computed(() => this.cartService.totalCount() * MAX_STARS);

  private readonly totals = computed<Record<StatKey, number>>(() => {
    const totals: Record<StatKey, number> = { strength: 0, heroism: 0, wisdom: 0 };

    for (const { product, quantity } of this.cartService.items()) {
      for (const { key } of this.statDefinitions) {
        totals[key] += this.statValue(product, key) * quantity;
      }
    }

    return totals;
  });

  protected readonly summaryBars = computed(() =>
    this.statDefinitions.map((stat) => {
      const total = this.totals()[stat.key];
      return { ...stat, total, percent: this.percentOf(total) };
    })
  );

  protected readonly grandTotal = computed(() => {
    const { strength, heroism, wisdom } = this.totals();
    return strength + heroism + wisdom;
  });

  protected statValue(product: Product, stat: StatKey): number {
    return product.stats?.[stat] ?? 0;
  }

  protected starsFor(product: Product, stat: StatKey): string {
    const filled = Math.min(Math.max(this.statValue(product, stat), 0), MAX_STARS);
    return '★'.repeat(filled) + '☆'.repeat(MAX_STARS - filled);
  }

  protected dispatchArmy(): void {
    if (this.cartService.items().length === 0) return;

    const figures = formatFigures(this.cartService.totalCount());
    const grandTotal = this.grandTotal();

    this.cartService.clear();
    this.dispatchSuccessMessage.set(
      `Your army (${figures}, ${grandTotal} total virtue stars) has been dispatched.`
    );
  }

  private percentOf(value: number): number {
    const max = this.maxStatPossible();
    return max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  }
}