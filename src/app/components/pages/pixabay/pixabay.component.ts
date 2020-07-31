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
    if (sessionStorage.getItem('pixabay-page-number') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pixabay-page-number'));
    }

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.queryString = query;

      //Grab old query string
      if (sessionStorage.getItem('old-pixabay-query') !== null) {
        this.oldQueryString = sessionStorage.getItem('old-pixabay-query');
      }

      if (
        this.queryString !== '' &&
        this.queryString !== undefined &&
        this.queryString !== this.oldQueryString
      ) {
        sessionStorage.removeItem('pixabay-images');
        this.imageStorage.getImagesFromApi(this.queryString, 'pixabay');
      } else if (
        (this.queryString === this.oldQueryString || this.queryString === '') &&
        sessionStorage.getItem('pixabay-images') !== null
      ) {
        this.pixabayImages = JSON.parse(
          sessionStorage.getItem('pixabay-images')
        );
        this.noPics = this.pixabayImages.length === 0;
      }
    });

    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pixabayImages.subscribe((images) => {
      // on initial component load, store images directly in image array
      // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
      if (this.queryString !== this.oldQueryString) {
        this.pixabayImages = images;
        this.oldQueryString = this.queryString;
        this.pageNumber = 1;

        sessionStorage.setItem('old-pixabay-query', this.oldQueryString);

        sessionStorage.setItem(
          'pixabay-page-number',
          this.pageNumber.toString()
        );

        sessionStorage.setItem(
          'pixabay-images',
          JSON.stringify(this.pixabayImages)
        );
      } else {
        // otherwise, add images to existing array and update session storage
        this.pixabayImages = [...this.pixabayImages, ...images];

        sessionStorage.setItem(
          'pixabay-images',
          JSON.stringify(this.pixabayImages)
        );
      }
      this.noPics = this.pixabayImages.length === 0;
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

    sessionStorage.setItem('pixabay-page-number', this.pageNumber.toString());
  }
}
