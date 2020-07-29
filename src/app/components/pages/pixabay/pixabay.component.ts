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
  oldQueryString: string = '';
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

      if (this.queryString != this.oldQueryString) {
        this.imageStorage.getImagesFromApi(this.queryString, 'pixabay');
      }
    });

    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pixabayImages.subscribe((images) => {
      if (images.length === 0) {
        this.noPics = true;
      } else {
        this.noPics = false;

        // on initial component load, store images directly in image array
        // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
        if (this.queryString !== this.oldQueryString) {
          this.pixabayImages = images;
          this.oldQueryString = this.queryString;
          this.pageNumber = 1;
        } else {
          // otherwise, add images to existing array and update session storage
          this.pixabayImages = [...this.pixabayImages, ...images];
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    this.imageStorage.getImagesFromApi(
      this.queryString,
      'pixabay',
      30,
      ++this.pageNumber
    );
  }
}
