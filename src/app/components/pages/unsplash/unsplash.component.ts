import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { UnsplashApiService } from 'src/app/services/unsplash-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsplash',
  templateUrl: './unsplash.component.html',
  styleUrls: ['./unsplash.component.scss'],
})
export class UnsplashComponent implements OnInit, OnDestroy {
  // Ensuring cleanup of subscriptions when component is destroyed
  // Not sure if entirely needed, but putting just in case
  unsubscribe = new Subject<void>();

  unsplashImages: Image[];
  queryString: string;

  constructor(
    private unsplash: UnsplashApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.imageStorage
      .getImages('unsplash')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((images) => (this.unsplashImages = images));

    this.doSearch();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSearch(query): void {
    this.doSearch();
  }

  doSearch(): void {
    this.imageStorage
      .getQueryString()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((query) => {
        if (query) this.getImages(query);
      });
  }

  getImages(query) {
    if (query !== true) {
      this.unsplash
        .getUnsplashImages(query)
        .subscribe((images) => {
          const imageArr = images.results.map(
            (image) => new Image(image, 'unsplash')
          );
          this.imageStorage.addImages(imageArr, 'unsplash');
        });
    }
  }
}
