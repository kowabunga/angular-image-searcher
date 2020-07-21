import { Component, OnInit, onDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { PexelsApiService } from '../../../services/pexels-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit {
  // Ensuring cleanup of subscriptions when component is destroyed
  // Not sure if entirely needed, but putting just in case
  unsubscribe = new Subject<void>();

  pexelsImages: Image[];
  queryString: string;

  constructor(
    private pexels: PexelsApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.imageStorage
      .getImages('pexels')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((images) => (this.pexelsImages = images));

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
      this.pexels.getPexelImages(query).subscribe((images) => {
        const imageArr = images.photos.map(
          (image) => new Image(image, 'pexels')
        );
        this.imageStorage.addImages(imageArr, 'pexels');
      });
    }
  }
}
