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
  unsplashImages: Image[];
  getQueryString: any;
  queryString: string;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage
      .getImages('unsplash')
      .subscribe((images) => (this.unsplashImages = images));

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      if (query !== '') this.imageStorage.getImagesFromApi(query, 'unsplash');

      this.queryString = query;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  onSearch(query): void {
    console.log(this.queryString);
    this.imageStorage.getImagesFromApi(this.queryString, 'unsplash');
  }
}
