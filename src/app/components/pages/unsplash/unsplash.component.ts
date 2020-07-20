import { Component, OnInit } from '@angular/core';
import { Image } from '../../../models/image';
import { UnsplashApiService } from 'src/app/services/unsplash-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-unsplash',
  templateUrl: './unsplash.component.html',
  styleUrls: ['./unsplash.component.scss'],
})
export class UnsplashComponent implements OnInit {
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
      .subscribe((images) => (this.unsplashImages = images));

    this.doSearch();
  }

  onSearch(query): void {
    this.doSearch();
  }

  doSearch(): void {
    this.imageStorage.getQueryString().subscribe((query) => {
      if (query) {
        this.queryString = query;
        this.getImages(this.queryString);
      }
    });
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
