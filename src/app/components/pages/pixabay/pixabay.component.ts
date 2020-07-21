import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { PixabayApiService } from 'src/app/services/pixabay-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pixabay',
  templateUrl: './pixabay.component.html',
  styleUrls: ['./pixabay.component.scss'],
})
export class PixabayComponent implements OnInit, OnDestroy {
  // Ensuring cleanup of subscriptions when component is destroyed
  // Not sure if entirely needed, but putting just in case
  unsubscribe = new Subject<void>();

  getQueryString: any;
  pixabayImages: Image[];
  queryString: string;

  constructor(
    private pixabay: PixabayApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.imageStorage
      .getImages('pixabay')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((images) => (this.pixabayImages = images));

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
      this.pixabay.getPixabayImages(query).subscribe((images) => {
        const imageArr = images.hits.map(
          (image) => new Image(image, 'pixabay')
        );
        this.imageStorage.addImages(imageArr, 'pixabay');
      });
    }
  }
}
