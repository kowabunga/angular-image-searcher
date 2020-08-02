import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { PageHistoryService } from 'src/app/services/page-history.service';

@Component({
  selector: 'app-unsplash',
  templateUrl: './unsplash.component.html',
  styleUrls: ['./unsplash.component.scss'],
})
export class UnsplashComponent implements OnInit, OnDestroy {
  unsplashImages: Image[] = [];
  queryString: string;
  getQueryString: any;
  oldQueryString: string;
  getImages: any;
  pageNumber: number = 1;
  noPics: boolean = false;

  constructor(
    private imageStorage: ImageStorageService,
    private pageHistory: PageHistoryService
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('unsplash-page-number') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pexel-page-number'));
    }

    // Load page number
    if (sessionStorage.getItem('unsplash-pageNum') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('unsplash-pageNum'));
    }

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.queryString = query;

      // On page reload, behavior subject can return empty string (since its default value is an empty string). If so, grab the item from session storage
      //Grab old query string
      if (sessionStorage.getItem('old-unsplash-query') !== null) {
        this.oldQueryString = sessionStorage.getItem('old-unsplash-query');
      }

      if (this.queryString === '') {
        this.queryString = this.oldQueryString;
      }

      if (
        this.queryString !== '' &&
        this.queryString !== undefined &&
        this.queryString !== this.oldQueryString
      ) {
        sessionStorage.removeItem('unsplash-images');
        this.imageStorage.getImagesFromApi(this.queryString, 'unsplash');
      } else if (
        this.queryString === this.oldQueryString &&
        sessionStorage.getItem('unsplash-images') !== null &&
        this.oldQueryString === this.getOldQuery()
      ) {
        this.queryString = this.oldQueryString;
        this.unsplashImages = JSON.parse(
          sessionStorage.getItem('unsplash-images')
        );
        this.noPics = this.unsplashImages.length === 0;
      } else if (this.oldQueryString !== this.getOldQuery()) {
        const searchParam = this.getOldQuery();
        this.imageStorage.setQueryString(searchParam);
      }

      this.pageHistory.setCurrentPage();
    });

    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.unsplashImages.subscribe((images) => {
      // on initial component load, store images directly in image array
      // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
      if (this.queryString !== this.oldQueryString) {
        this.unsplashImages = images;
        this.oldQueryString = this.queryString;
        this.pageNumber = 1;

        sessionStorage.setItem('old-unsplash-query', this.oldQueryString);

        sessionStorage.setItem(
          'unsplash-page-number',
          this.pageNumber.toString()
        );

        sessionStorage.setItem(
          'unsplash-images',
          JSON.stringify(this.unsplashImages)
        );
      } else {
        // otherwise, add images to existing array and update session storage
        this.unsplashImages = [...this.unsplashImages, ...images];

        sessionStorage.setItem(
          'unsplash-images',
          JSON.stringify(this.unsplashImages)
        );
      }
      this.noPics = this.unsplashImages.length === 0;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    this.imageStorage.getImagesFromApi(
      this.queryString,
      'unsplash',
      30,
      ++this.pageNumber
    );
    sessionStorage.setItem('unsplash-page-number', this.pageNumber.toString());
  }

  getOldQuery(): string {
    let url = this.pageHistory.getPrevPageFromSessionStorage();
    url = url.replace(/\//g, '');

    const searchParam = sessionStorage.getItem(`old-${url}-query`);

    return searchParam;
  }
}
