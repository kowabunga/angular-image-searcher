import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { PexelsApiService } from '../../../services/pexels-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit, OnDestroy {
  pexelsImages: Image[] = [];
  getQueryString: any;
  queryString: string;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage
      .getImages('pexels')
      .subscribe((images) => (this.pexelsImages = images));

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      if (query !== '') {
        this.imageStorage.getImagesFromApi(query, 'pexels');

        // Clear current search results in session storage on page new search
        if (sessionStorage.getItem('pexel-images'))
          sessionStorage.removeItem('pexel-images');
      }

      this.queryString = query;
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

  // @TODO get rid of emit - probably not necessary
  onSearch(query): void {
    console.log(this.queryString);
    this.imageStorage.getImagesFromApi(this.queryString, 'pexels');
  }
}
