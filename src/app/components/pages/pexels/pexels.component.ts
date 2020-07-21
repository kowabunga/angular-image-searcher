import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PexelsComponent implements OnInit, OnDestroy {
  // Ensuring cleanup of subscriptions when component is destroyed
  // Not sure if entirely needed, but putting just in case
  unsubscribe = new Subject<void>();

  pexelsImages: Image[];
  getQueryString: any;
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

  // @TODO get rid of emit - probably not necessary
  onSearch(query): void {
    console.log(this.queryString);
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
