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

  getQueryString: any;
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

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      console.log(query);
      this.queryString = query;
    });

    if (this.queryString) {
      this.getImages(this.queryString);
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSearch(query): void {
    console.log(this.queryString);
    this.getImages(this.queryString);
  }

  getImages(query) {
    if (query !== true) {
      this.unsplash.getUnsplashImages(query).subscribe((images) => {
        const imageArr = images.results.map(
          (image) => new Image(image, 'unsplash')
        );
        this.imageStorage.addImages(imageArr, 'unsplash');
      });
    }
  }
}
