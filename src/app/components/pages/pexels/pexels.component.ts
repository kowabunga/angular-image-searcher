import { Component, OnInit, OnDestroy } from '@angular/core';

import { Image } from '../../../models/image';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit, OnDestroy {
  pexelsImages: Image[] = [];
  queryString: string;
  getQueryString: any;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pexelsImages.subscribe((images) => {
      //@TODO Old query string to compare.
      // !If same query string, do this.
      // this.pexelsImages = [...this.pexelsImages, ...images];
      // !If diff query string, do this:
      this.pexelsImages = images;
      if (sessionStorage.getItem('pexel-images') === null)
        sessionStorage.setItem('pexel-images', JSON.stringify(images));
    });

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.imageStorage.getImagesFromApi(query, 'pexels');

      this.queryString = query;

      // On page reload, behavior subject can return empty string (since its default value is an empty string). If so, grab the item from session storage
      if (
        this.queryString === '' &&
        sessionStorage.getItem('query-string') !== null
      )
        this.queryString = sessionStorage.getItem('query-string');
      console.log(this.queryString);
    });

    // Check if image array is empty and there are items in session storage. If so, grab the items from session storage
    if (
      this.pexelsImages.length === 0 &&
      sessionStorage.getItem('pexel-images') !== null
    ) {
      this.pexelsImages = JSON.parse(sessionStorage.getItem('pexel-images'));
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }
}
