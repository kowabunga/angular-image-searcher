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
  constructor(
    private pixabay: PixabayApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    this.imageStorage
      .getImages('pixabay')
      .subscribe((images) => (this.pixabayImages = images));
  }

  onSearch(query): void {
    this.pixabay.getPixabayImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.photos.map(
        (image) => new Image(image, 'pixabay')
      );
      this.imageStorage.addImages(imageArr, 'pixabay');
      this.imageStorage
        .getImages('pixabay')
        .subscribe((images) => (this.pixabayImages = images));
    });
  }
}
