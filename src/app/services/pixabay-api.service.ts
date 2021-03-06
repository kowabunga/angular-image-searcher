import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root',
})
export class PixabayApiService {
  pixabayImages: Image[];

  constructor(private http: HttpClient) {}

  getPixabayImages(query: string, perPage: number, page:number): Observable<any> {
    return this.http.get<any>(
      `https://pixabay.com/api/?key=${environment.PIXABAY_API}&q=${query}&image_type=photo&pretty=true&per_page=${perPage}&page=${page}`
    );
  }
}
