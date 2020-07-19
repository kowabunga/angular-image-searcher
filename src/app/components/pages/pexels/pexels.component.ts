import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../../../models/image';
import { PexelsApiService } from '../../../services/pexels-api.service';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit {
  pexelsImages: Image[];

  constructor(private pexels: PexelsApiService) {}

  ngOnInit(): void {}

  onSearch(query) {
    this.pexels.getPexelImages(query).subscribe((images) => {
      console.log(images);
      const imageArr = images.photos;
      this.pexelsImages = imageArr.map((image) => new Image(image, 'pexels'));
    });
  }
}
