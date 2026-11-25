import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NotFoundAction {
  label: string;
  link: string;
  variant: 'primary' | 'secondary';
}

@Component({
  imports: [RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {
  protected readonly code = '404';
  protected readonly title = 'Lost in the Underworld';
  protected readonly message =
    'This path leads nowhere the archive has charted. Even the Fates could not find the page you seek.';

  protected readonly actions: NotFoundAction[] = [
    { label: 'Return home', link: '/', variant: 'primary' },
    { label: 'Browse the archive', link: '/catalog', variant: 'secondary' },
  ];
}