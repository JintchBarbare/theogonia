import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HeroAction {
  label: string;
  link: string;
  variant: 'primary' | 'secondary';
  showArrow?: boolean;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly title = 'Theogony';
  protected readonly quote =
    'Before the gods there was Chaos. From it came night, the earth, and every story told since.';

  protected readonly actions: HeroAction[] = [
    { label: 'Enter the Pantheon', link: '/catalog', variant: 'primary', showArrow: true },
    { label: 'Your pantheon', link: '/cart', variant: 'secondary' }
  ];
}