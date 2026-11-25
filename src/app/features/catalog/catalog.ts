import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { CartService } from '../../shared/services/cart.service';

type StatKey = 'strength' | 'heroism' | 'wisdom';
type MinStats = Record<StatKey, number>;

interface StatDefinition {
  key: StatKey;
  label: string;
  icon: string;
}

interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

const ALL_CATEGORIES = 'ALL';
const MAX_STARS = 5;
const LOAD_ERROR_TEXT = 'Could not load the archive.';

const categoryOf = (product: Product): string =>
  (product.category || product.type || '').trim();

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly cartService = inject(CartService);

  protected readonly statDefinitions: StatDefinition[] = [
    { key: 'strength', label: 'Strength', icon: '⚔' },
    { key: 'heroism', label: 'Heroism', icon: '🛡' },
    { key: 'wisdom', label: 'Wisdom', icon: '🪶' },
  ];

  protected readonly starValues = Array.from({ length: MAX_STARS }, (_, i) => i + 1);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selectedCategory = signal(ALL_CATEGORIES);
  protected readonly minStats = signal<MinStats>({ strength: 0, heroism: 0, wisdom: 0 });

  protected readonly categoryOptions = computed<CategoryOption[]>(() => {
    const counts = new Map<string, number>();

    for (const product of this.products()) {
      const name = categoryOf(product);
      if (name) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }

    return [
      { value: ALL_CATEGORIES, label: 'All', count: this.products().length },
      ...Array.from(counts, ([name, count]) => ({ value: name, label: name, count })),
    ];
  });

  protected readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const minStats = this.minStats();

    return this.products().filter(
      (product) =>
        (category === ALL_CATEGORIES || categoryOf(product) === category) &&
        this.statDefinitions.every(({ key }) => (product.stats?.[key] ?? 0) >= minStats[key])
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(LOAD_ERROR_TEXT);
        this.loading.set(false);
      },
    });
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected setMinStat(stat: StatKey, value: number): void {
    this.minStats.update((current) => ({
      ...current,
      [stat]: current[stat] === value ? 0 : value,
    }));
  }

  protected resetFilters(): void {
    this.selectedCategory.set(ALL_CATEGORIES);
    this.minStats.set({ strength: 0, heroism: 0, wisdom: 0 });
  }

  protected starsFor(product: Product, stat: StatKey): string {
    const filled = Math.min(Math.max(product.stats?.[stat] ?? 0, 0), MAX_STARS);
    return '★'.repeat(filled) + '☆'.repeat(MAX_STARS - filled);
  }

  protected addToPantheon(product: Product): void {
    this.cartService.addItem(product);
  }

  protected increaseQty(productId: string): void {
    this.cartService.increment(productId);
  }

  protected decreaseQty(productId: string): void {
    this.cartService.decrement(productId);
  }
}