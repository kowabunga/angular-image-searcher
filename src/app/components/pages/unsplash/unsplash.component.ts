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

  constructor(
    private unsplash: UnsplashApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    this.imageStorage
      .getImages('unsplash')
      .subscribe((images) => (this.unsplashImages = images));
  }

  onSearch(query): void {
    this.unsplash.getUnsplashImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.results.map(
        (image) => new Image(image, 'unsplash')
      );
      this.imageStorage.addImages(imageArr, 'unsplash');
      this.imageStorage
        .getImages('unsplash')
        .subscribe((images) => (this.unsplashImages = images));
    });
  }
}
