import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Post, PostsResponse } from '../models/post.model';

const API_URL = 'https://dummyjson.com/posts';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http
      .get<PostsResponse>(`${API_URL}?limit=12`)
      .pipe(map((response) => response.posts));
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${API_URL}/${id}`);
  }
}