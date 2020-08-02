import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { PageHistoryService } from 'src/app/services/page-history.service';

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

  constructor(
    private imageStorage: ImageStorageService,
    private pageHistory: PageHistoryService
  ) {}

  ngOnInit(): void {
    // remove home indicator from session storage
    if (sessionStorage.getItem('prev-location') !== null) {
      sessionStorage.removeItem('prev-location');
    }

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

      if (this.queryString === '') {
        this.queryString = this.oldQueryString;
      }

      // If query isn't an empty string, undefined, or equal to the old string, remove the old items from session storage and send request to api for new images
      if (
        this.queryString !== '' &&
        this.queryString !== undefined &&
        this.queryString !== this.oldQueryString
      ) {
        sessionStorage.removeItem('pixabay-images');
        this.imageStorage.getImagesFromApi(this.queryString, 'pixabay');

        // if querystring is equal to old query string and session storage item for images isnt empty AND old query string is equal to query string from previous page - get items from session storage
      } else if (
        this.queryString === this.oldQueryString &&
        sessionStorage.getItem('pixabay-images') !== null &&
        this.oldQueryString === this.pageHistory.getOldQuery()
      ) {
        this.queryString = this.oldQueryString;
        this.pixabayImages = JSON.parse(
          sessionStorage.getItem('pixabay-images')
        );
        this.noPics = this.pixabayImages.length === 0;

        // Else, if old query isn't equal to query from previous page after refresh (i.e. new query), set query string and emit new value repeating above logic
      } else if (this.oldQueryString !== this.pageHistory.getOldQuery()) {
        const searchParam = this.pageHistory.getOldQuery();
        this.imageStorage.setQueryString(searchParam);
      }

      this.pageHistory.setCurrentPage();
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
