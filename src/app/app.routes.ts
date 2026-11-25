import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Catalog } from './features/catalog/catalog';
import { ProductDetail } from './features/product-detail/product-detail';
import { Cart } from './features/cart/cart';
import { Contact } from './features/contact/contact';
import { BlogList } from './features/blog/blog-list/blog-list';
import { BlogDetail } from './features/blog/blog-detail/blog-detail';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Theogony — Home'
  },
  {
    path: 'catalog',
    component: Catalog,
    title: 'Theogony — Catalog'
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    title: 'Theogony — Figure'
  },
  {
    path: 'cart',
    component: Cart,
    title: 'Theogony — Your Pantheon'
  },
  {
    path: 'contact',
    component: Contact,
    title: 'Theogony — Contact'
  },
  {
    path: 'blog',
    component: BlogList,
    title: 'Theogony — Chronicles'
  },
  {
    path: 'blog/:id',
    component: BlogDetail,
    title: 'Theogony — Chronicle'
  },
  {
    path: '**',
    component: NotFound,
    title: 'Theogony — 404 Not Found'
  }
];