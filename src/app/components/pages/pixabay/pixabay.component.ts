import { Component, OnInit } from '@angular/core';
import { Image } from '../../../models/image';
import { PixabayApiService } from 'src/app/services/pixabay-api.service';

@Component({
  selector: 'app-pixabay',
  templateUrl: './pixabay.component.html',
  styleUrls: ['./pixabay.component.scss'],
})
export class PixabayComponent implements OnInit {
  pixabayImages: Image[];
  constructor(private pixabay: PixabayApiService) {}

  ngOnInit(): void {}

  onSearch(query) {
    this.pixabay.getPixabayImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.hits;
      this.pixabayImages = imageArr.map((image) => new Image(image, 'pixabay'));
    });
  }
}
