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
    // Load page number
    if (sessionStorage.getItem('pexels-pageNum') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pexels-pageNum'));
    }
    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      // Make sure to
      this.imageStorage.getImagesFromApi(query, 'pexels');

      if (this.queryString !== query && this.queryString !== undefined) {
        this.oldQueryString = this.queryString;
      }

      this.queryString = query;

      // On page reload, behavior subject can return empty string (since its default value is an empty string). If so, grab the item from session storage
      if (
        this.queryString === '' &&
        sessionStorage.getItem('query-string') !== null
      ) {
        this.queryString = sessionStorage.getItem('query-string');
        this.firstLoad = false;
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
      } else {
        // otherwise, add images to existing array
        this.pexelsImages = [...this.pexelsImages, ...images];
      }
      this.morePics = true;

      if (sessionStorage.getItem('pexel-images') === null)
        sessionStorage.setItem('pexel-images', JSON.stringify(images));
    });

    // Check if image array is empty and there are items in session storage. If so, grab the items from session storage
    if (
      this.pexelsImages.length === 0 &&
      sessionStorage.getItem('pexel-images') !== null
    ) {
      this.pexelsImages = JSON.parse(sessionStorage.getItem('pexel-images'));
      this.oldQueryString = sessionStorage.getItem('query-string');
      this.queryString = sessionStorage.getItem('query-string');
    }

    // Handle loading more images on scroll to bottom
    // window.addEventListener('scroll', this.loadPictures);
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
