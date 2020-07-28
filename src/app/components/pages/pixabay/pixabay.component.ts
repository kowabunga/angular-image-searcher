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
  firstLoad: boolean = true;
  pageNumber: number = 1;
  morePics: boolean = false;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Load page number
    if (sessionStorage.getItem('pixabay-pageNum') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pixabay-pageNum'));
    }

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.imageStorage.getImagesFromApi(query, 'pixabay');

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
    this.getImages = this.imageStorage.pixabayImages.subscribe((images) => {
      // on initial component load, store images directly in image array
      // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
      if (this.firstLoad || this.queryString !== this.oldQueryString) {
        this.pixabayImages = images;
        this.firstLoad = false;
        this.oldQueryString = this.queryString;
      } else {
        // otherwise, add images to existing array
        console.log('Equal, obvs');
        this.pixabayImages = [...this.pixabayImages, ...images];
      }
      this.morePics = true;
      if (sessionStorage.getItem('pixabay-images') === null)
        sessionStorage.setItem('pixabay-images', JSON.stringify(images));
    });

    // Check if image array is empty and there are items in session storage. If so, grab the items from session storage
    if (
      this.pixabayImages.length === 0 &&
      sessionStorage.getItem('pixabay-images') !== null
    ) {
      this.pixabayImages = JSON.parse(sessionStorage.getItem('pixabay-images'));
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    if (this.morePics) {
      this.imageStorage.getImagesFromApi(
        this.queryString,
        'pixabay',
        30,
        ++this.pageNumber
      );
      this.morePics = false;
      sessionStorage.setItem(
        'pixabay-pageNum',
        JSON.stringify(this.pageNumber)
      );
    }
  }
}
