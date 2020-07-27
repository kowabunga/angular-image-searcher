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
  getImages: any;
  firstLoad: boolean = true;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pixabayImages.subscribe((images) => {
      //on initial component load, store images directly in image array
      if (this.firstLoad) {
        this.pixabayImages = images;
        this.firstLoad = false;
      } else {
        //otherwise, add images to existing array
        this.pixabayImages = [...this.pixabayImages, ...images];
      }

      if (sessionStorage.getItem('pixabay-images') === null)
        sessionStorage.setItem('pixabay-images', JSON.stringify(images));
    });

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.imageStorage.getImagesFromApi(query, 'pixabay');

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
    if (sessionStorage.getItem('pixabay-images') !== null) {
      this.pixabayImages = JSON.parse(sessionStorage.getItem('pixabay-images'));
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }
}
