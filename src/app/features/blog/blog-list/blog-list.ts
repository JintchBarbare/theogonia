import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';

const LOAD_ERROR_TEXT = 'Could not load the chronicles.';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  styleUrl: './blog-list.css',
  templateUrl: './blog-list.html',
})
export class BlogList implements OnInit {
  private readonly postService = inject(PostService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

  protected loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(LOAD_ERROR_TEXT);
        this.loading.set(false);
      },
    });
  }
}