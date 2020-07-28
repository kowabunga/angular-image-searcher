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
  firstLoad: boolean = true;
  pageNumber: number = 1;
  morePics: boolean = false;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Check if image array is empty and there are items in session storage. If so, grab the items from session storage
    if (
      this.pexelsImages.length === 0 &&
      sessionStorage.getItem('pexel-images') !== null
    ) {
      this.pexelsImages = JSON.parse(sessionStorage.getItem('pexel-images'));
      this.queryString = sessionStorage.getItem('query-string');
    }

    // Load page number
    if (sessionStorage.getItem('pexels-pageNum') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pexels-pageNum'));
    }
    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      // On page reload, behavior subject can return empty string (since its default value is an empty string). If so, grab the item from session storage
      this.queryString = query;

      if (
        this.queryString === '' &&
        sessionStorage.getItem('query-string') !== null
      ) {
        this.queryString = sessionStorage.getItem('query-string');
        this.firstLoad = false;
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
      if (this.firstLoad || this.queryString !== this.oldQueryString) {
        this.pexelsImages = images;
        this.firstLoad = false;
        this.oldQueryString = this.queryString;
        sessionStorage.setItem('pexels-pageNum', '1');
        this.pageNumber = 1;
      } else {
        // otherwise, add images to existing array and update session storage
        this.pexelsImages = [...this.pexelsImages, ...images];
        sessionStorage.setItem(
          'pexel-images',
          JSON.stringify(this.pexelsImages)
        );
      }
      this.morePics = true;

      if (sessionStorage.getItem('pexel-images') === null) {
        sessionStorage.setItem('pexel-images', JSON.stringify(images));
      }
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    if (this.morePics) {
      this.imageStorage.getImagesFromApi(
        this.queryString,
        'pexels',
        30,
        ++this.pageNumber
      );
      this.morePics = false;
      sessionStorage.setItem('pexels-pageNum', JSON.stringify(this.pageNumber));
    }
  }
}
