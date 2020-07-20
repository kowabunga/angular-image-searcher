import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../../../models/image';
import { PexelsApiService } from '../../../services/pexels-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit {
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
      .subscribe((images) => (this.pexelsImages = images));

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
      this.pexels.getPexelImages(query).subscribe((images) => {
        const imageArr = images.photos.map(
          (image) => new Image(image, 'pexels')
        );
        this.imageStorage.addImages(imageArr, 'pexels');
      });
    }
  }
}
