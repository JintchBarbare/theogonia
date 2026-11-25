import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';

const LOAD_ERROR_TEXT = 'Could not load the chronicle.';
const NOT_FOUND_STATUS = 404;

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink],
  styleUrl: './blog-detail.css',
  templateUrl: './blog-detail.html',
})
export class BlogDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);

  private currentId = '';

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly post = signal<Post | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadPost(id);
      } else {
        this.post.set(null);
        this.loading.set(false);
      }
    });
  }

  protected retry(): void {
    if (this.currentId) {
      this.loadPost(this.currentId);
    }
  }

  private loadPost(id: string): void {
    this.currentId = id;
    this.loading.set(true);
    this.error.set(null);

    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.post.set(null);
        if (err.status !== NOT_FOUND_STATUS) {
          this.error.set(LOAD_ERROR_TEXT);
        }
        this.loading.set(false);
      },
    });
  }
}