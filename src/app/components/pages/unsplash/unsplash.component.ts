import { Component, OnInit } from '@angular/core';
import { Image } from '../../../models/image';
import { UnsplashApiService } from 'src/app/services/unsplash-api.service';

@Component({
  selector: 'app-unsplash',
  templateUrl: './unsplash.component.html',
  styleUrls: ['./unsplash.component.scss'],
})
export class UnsplashComponent implements OnInit {
  unsplashImages: Image[];

  constructor(private unsplash: UnsplashApiService) {}

  ngOnInit(): void {}

  onSearch(query) {
    this.unsplash.getUnsplashImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.results;
      this.unsplashImages = imageArr.map(
        (image) => new Image(image, 'unsplash')
      );
    });
  }
}
