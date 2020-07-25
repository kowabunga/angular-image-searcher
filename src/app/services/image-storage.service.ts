import { Injectable } from '@angular/core';
import { Image } from '../models/image';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { PexelsApiService } from './pexels-api.service';
import { PixabayApiService } from './pixabay-api.service';
import { UnsplashApiService } from './unsplash-api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private oldQuery:string='';
  private query: BehaviorSubject<string> = new BehaviorSubject('');
  queryString = this.query.asObservable();

  pexImages: Subject<Image[]> = new Subject();
  pexelsImages = this.pexImages.asObservable();

  pixImages: Subject<Image[]> = new Subject();
  pixabayImages = this.pixImages.asObservable();

  unImages: Subject<Image[]> = new Subject();
  unsplashImages = this.unImages.asObservable();

  constructor(
    private pexels: PexelsApiService,
    private pixabay: PixabayApiService,
    private unsplash: UnsplashApiService
  ) {}

  setQueryString(query: string) {
    if (query !== '') this.query.next(query);
  }

  getImagesFromApi(query: string, type: string): void {
    switch (type) {
      case 'pexels':
        console.log('GetImages Ran');
        this.pexels.getPexelImages(query).subscribe((images: any) => {
          const imageArr: Image[] = images.photos.map(
            (image) => new Image(image, 'pexels')
          );
          this.getImages(imageArr, 'pexels');
        });
        break;

      case 'pixabay':
        this.pixabay.getPixabayImages(query).subscribe((images: any) => {
          const imageArr: Image[] = images.hits.map(
            (image) => new Image(image, 'pixabay')
          );
          this.getImages(imageArr, 'pixabay');
        });
        break;

      case 'unsplash':
        this.unsplash.getUnsplashImages(query).subscribe((images: any) => {
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

  getImages(images: Image[], type: string): void {
    // Add images to image array *and* add to session storage based on picture type

    switch (type) {
      case 'pexels':
        // Clear current search results in session storage on new search
        if (sessionStorage.getItem('pexel-images')) {
          sessionStorage.removeItem('pexel-images');
        }

        this.pexImages.next(images);
        break;

      case 'pixabay':
        // Clear current search results in session storage on new search
        if (sessionStorage.getItem('pixabay-images')) {
          sessionStorage.removeItem('pixabay-images');
        }

        this.pixImages.next(images);
        break;

      case 'unsplash':
        // Clear current search results in session storage on new search
        if (sessionStorage.getItem('unsplash-images')) {
          sessionStorage.removeItem('unsplash-images');
        }

        this.unImages.next(images);
        break;

      default:
        break;
    }
  }
}
