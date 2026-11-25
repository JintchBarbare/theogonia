import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface FooterNavItem {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  readonly brandTitle = 'Theogony';
  readonly tagline =
    'A quiet archive of the deathless and the half-divine — catalogued, rated, and kept for those who still listen to old stories.';

  readonly navItems: FooterNavItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'The Gods', path: '/catalog' },
    { label: 'Your Pantheon', path: '/cart' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  readonly colophonTitle = 'COLOPHON';
  readonly colophonText =
    'Portraits painted for this archive. Sources: Hesiod, Homer, Ovid, and the long memory of oral tradition.';

  readonly bottomNote = '© 2026 THEOGONIA · ἘΝ ΑΡΧΗΙ ἮΝ ΤΟ ΧΆΟΣ';
}