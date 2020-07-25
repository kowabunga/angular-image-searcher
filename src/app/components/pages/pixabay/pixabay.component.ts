import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-pixabay',
  templateUrl: './pixabay.component.html',
  styleUrls: ['./pixabay.component.scss'],
})
export class PixabayComponent implements OnInit, OnDestroy {
  pixabayImages: Image[] = [];
  queryString: string;
  getQueryString: any;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pixabayImages.subscribe((images) => {
      this.pixabayImages = [...this.pixabayImages, ...images];

    });

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.imageStorage.getImagesFromApi(query, 'pixabay');

      this.queryString = query;
    });

    // Check if image array is empty and there are items in session storage. If so, grab the items from session storage
    if (sessionStorage.getItem('pixabay-images') !== null) {
      this.pixabayImages = JSON.parse(sessionStorage.getItem('pixabay-images'));
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }
}
