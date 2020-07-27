import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '.././/../environments/environment';
import { Observable } from 'rxjs';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root',
})
export class UnsplashApiService {
  unsplashImages: Image[];

  constructor(private http: HttpClient) {}

  getUnsplashImages(query: string, perPage: number): Observable<any> {
    return this.http.get<any>(
      `https://api.unsplash.com/search/photos/?client_id=${environment.UNSPLASH_API}&query=${query}&page=1&per_page=${perPage}`
    );
  }
}
