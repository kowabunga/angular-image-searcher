import { Component, OnInit } from '@angular/core';
import { Image } from '../../../models/image';
import { PixabayApiService } from 'src/app/services/pixabay-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-pixabay',
  templateUrl: './pixabay.component.html',
  styleUrls: ['./pixabay.component.scss'],
})
export class PixabayComponent implements OnInit {
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
      .subscribe((images) => (this.pixabayImages = images));

    // Subscribe to query string (search input) changes and perform search immediatly upon component load and on query string state change
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
      this.pixabay.getPixabayImages(query).subscribe((images) => {
        const imageArr = images.hits.map(
          (image) => new Image(image, 'pixabay')
        );
        this.imageStorage.addImages(imageArr, 'pixabay');
      });
    }
  }
}
