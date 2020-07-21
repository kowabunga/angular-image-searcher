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

    // Subscribe to query string (search input) changes and perform search immediatly upon component load and on query string state change
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
      this.pixabay.getPixabayImages(query).subscribe((images) => {
        const imageArr = images.hits.map(
          (image) => new Image(image, 'pixabay')
        );
        this.imageStorage.addImages(imageArr, 'pixabay');
      });
    }
  }
}
