import { Injectable } from '@angular/core';
import { Image } from '../models/image';
import { BehaviorSubject, Subject } from 'rxjs';
import { PexelsApiService } from './pexels-api.service';
import { PixabayApiService } from './pixabay-api.service';
import { UnsplashApiService } from './unsplash-api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private query: BehaviorSubject<string> = new BehaviorSubject('');
  queryString = this.query.asObservable();

  private pexImages: Subject<Image[]> = new Subject();
  pexelsImages = this.pexImages.asObservable();

  private pixImages: Subject<Image[]> = new Subject();
  pixabayImages = this.pixImages.asObservable();

  private unImages: Subject<Image[]> = new Subject();
  unsplashImages = this.unImages.asObservable();

  constructor(
    private pexels: PexelsApiService,
    private pixabay: PixabayApiService,
    private unsplash: UnsplashApiService
  ) {}

  setQueryString(query: string) {
    sessionStorage.setItem('query-string', query);

    if (query !== '') this.query.next(query);
  }

  getImagesFromApi(
    query: string,
    type: string,
    perPage = 30,
    page: number = 1
  ): void {
    if (query !== '') {
      switch (type) {
        case 'pexels':
          this.pexels
            .getPexelImages(query, perPage, page)
            .subscribe((images: any) => {
              const imageArr: Image[] = images.photos.map(
                (image) => new Image(image, 'pexels')
              );
              this.getImages(imageArr, 'pexels');
            });
          break;

        case 'pixabay':
          this.pixabay
            .getPixabayImages(query, perPage, page)
            .subscribe((images: any) => {
              const imageArr: Image[] = images.hits.map(
                (image) => new Image(image, 'pixabay')
              );
              this.getImages(imageArr, 'pixabay');
            });
          break;

        case 'unsplash':
          this.unsplash
            .getUnsplashImages(query, perPage, page)
            .subscribe((images: any) => {
              const imageArr: Image[] = images.results.map(
                (image) => new Image(image, 'unsplash')
              );
              this.getImages(imageArr, 'unsplash');
            });
          break;

        default:
          break;
      }
    }
  }

  getImages(images: Image[], type: string): void {
    // Return images based on type
    switch (type) {
      case 'pexels':
        this.pexImages.next(images);
        break;

      case 'pixabay':
        this.pixImages.next(images);
        break;

      case 'unsplash':
        this.unImages.next(images);
        break;

      default:
        break;
    }
  }
}
