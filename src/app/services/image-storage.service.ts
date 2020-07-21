import { Injectable } from '@angular/core';
import { Image } from '../models/image';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private query = new BehaviorSubject('');
  queryString = this.query.asObservable();
  
  pexelsImages: Image[] = [];
  pixabayImages: Image[] = [];
  unsplashImages: Image[] = [];

  constructor() {}

  setQueryString(query: string) {
    this.query.next(query);
  }

  addImages(images: Image[], type: string) {
    if (type === 'pexels') {
      images.forEach((image) => this.pexelsImages.push(image));
    } else if (type === 'pixabay') {
      images.forEach((image) => this.pixabayImages.push(image));
    } else if (type === 'unsplash') {
      images.forEach((image) => this.unsplashImages.push(image));
    }
  }

  getImages(type: string): Observable<Image[]> {
    if (type === 'pexels') {
      return of(this.pexelsImages);
    } else if (type === 'pixabay') {
      return of(this.pixabayImages);
    } else if (type === 'unsplash') {
      return of(this.unsplashImages);
    }
  }

  clearImages(): void {
    this.pexelsImages = [];
    this.pixabayImages = [];
    this.unsplashImages = [];
  }
}
