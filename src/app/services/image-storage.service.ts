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
    this.query.next(query);
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
              this.pexImages.next(imageArr);
            });
          break;

        case 'pixabay':
          this.pixabay
            .getPixabayImages(query, perPage, page)
            .subscribe((images: any) => {
              const imageArr: Image[] = images.hits.map(
                (image) => new Image(image, 'pixabay')
              );
              this.pixImages.next(imageArr);
            });
          break;

        case 'unsplash':
          this.unsplash
            .getUnsplashImages(query, perPage, page)
            .subscribe((images: any) => {
              const imageArr: Image[] = images.results.map(
                (image) => new Image(image, 'unsplash')
              );
              this.unImages.next(imageArr);
            });
          break;

        default:
          break;
      }
    }
  }
}
