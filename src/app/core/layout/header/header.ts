import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly cartCount = input<number>(0);

  protected readonly navItems: NavItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'The Gods', path: '/catalog' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];
}