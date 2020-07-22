import { Injectable } from '@angular/core';
import { Image } from '../models/image';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { PexelsApiService } from './pexels-api.service';
import { PixabayApiService } from './pixabay-api.service';
import { UnsplashApiService } from './unsplash-api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private query = new BehaviorSubject('');
  queryString = this.query.asObservable();

  pexelsImages: Image[] = [];
  pixabayImages: Image[] = [];
  unsplashImages: Image[] = [];

  constructor(
    private pexels: PexelsApiService,
    private pixabay: PixabayApiService,
    private unsplash: UnsplashApiService
  ) {}

  setQueryString(query: string) {
    this.query.next(query);
  }

  getImagesFromApi(query: string, type: string): void {
    switch (type) {
      case 'pexels':
        this.pexels.getPexelImages(query).subscribe((images: any) => {
          const imageArr = images.photos.map(
            (image) => new Image(image, 'pexels')
          );
          this.addImages(imageArr, 'pexels');
        });
        break;

      case 'pixabay':
        console.log('I RAN');
        this.pixabay.getPixabayImages(query).subscribe((images: any) => {
          const imageArr = images.hits.map(
            (image) => new Image(image, 'pixabay')
          );
          this.addImages(imageArr, 'pixabay');
        });
        break;

      case 'unsplash':
        this.unsplash.getUnsplashImages(query).subscribe((images: any) => {
          const imageArr = images.results.map(
            (image) => new Image(image, 'unsplash')
          );
          this.addImages(imageArr, 'unsplash');
        });
        break;

      default:
        break;
    }
  }

  addImages(images: Image[], type: string): void {
    switch (type) {
      case 'pexels':
        images.forEach((image) => this.pexelsImages.push(image));
        break;

      case 'pixabay':
        images.forEach((image) => this.pixabayImages.push(image));
        break;

      case 'unsplash':
        images.forEach((image) => this.unsplashImages.push(image));
        break;

      default:
        break;
    }
  }

  getImages(type: string): Observable<Image[]> {
    switch (type) {
      case 'pexels':
        return of(this.pexelsImages);

      case 'pixabay':
        return of(this.pixabayImages);

      case 'unsplash':
        return of(this.unsplashImages);

      default:
        break;
    }
  }

  clearImages(type: string): void {
    switch (type) {
      case 'pexels':
        this.pexelsImages = [];
        break;

      case 'pixabay':
        this.pixabayImages = [];
        break;

      case 'unsplash':
        this.unsplashImages = [];
        break;
      case 'all':
        this.pexelsImages = [];
        this.pixabayImages = [];
        this.unsplashImages = [];
        break;

      default:
        break;
    }
  }
}
