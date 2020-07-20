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

  constructor(
    private pexels: PexelsApiService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    this.imageStorage
      .getImages('pexels')
      .subscribe((images) => (this.pexelsImages = images));
  }

  onSearch(query): void {
    this.pexels.getPexelImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.photos.map((image) => new Image(image, 'pexels'));
      this.imageStorage.addImages(imageArr, 'pexels');
      this.imageStorage
        .getImages('pexels')
        .subscribe((images) => (this.pexelsImages = images));
    });
  }
}
