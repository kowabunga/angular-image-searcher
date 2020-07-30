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
  oldQueryString: string;
  getImages: any;
  pageNumber: number = 1;
  noPics: boolean = false;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      // On page reload, behavior subject can return empty string (since its default value is an empty string). If so, grab the item from session storage
      this.queryString = query;

      if (
        this.queryString === '' &&
        sessionStorage.getItem('query-string') !== null
      ) {
        this.queryString = sessionStorage.getItem('query-string');
      }

      // Make sure to
      if (this.queryString != this.oldQueryString) {
        this.imageStorage.getImagesFromApi(this.queryString, 'pexels');
      }
    });

    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pexelsImages.subscribe((images) => {
      // on initial component load, store images directly in image array
      // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
      if (this.queryString !== this.oldQueryString) {
        this.pexelsImages = images;
        this.oldQueryString = this.queryString;
        this.pageNumber = 1;
      } else {
        // otherwise, add images to existing array and update session storage
        this.pexelsImages = [...this.pexelsImages, ...images];
      }
      this.noPics = this.pexelsImages.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    this.imageStorage.getImagesFromApi(
      this.queryString,
      'pexels',
      30,
      ++this.pageNumber
    );
  }
}
