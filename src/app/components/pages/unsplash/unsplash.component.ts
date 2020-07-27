import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { UnsplashApiService } from 'src/app/services/unsplash-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsplash',
  templateUrl: './unsplash.component.html',
  styleUrls: ['./unsplash.component.scss'],
})
export class UnsplashComponent implements OnInit, OnDestroy {
  unsplashImages: Image[] = [];
  queryString: string;
  getQueryString: any;
  getImages: any;
  firstLoad: boolean = true;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.unsplashImages.subscribe((images) => {
      //on initial component load, store images directly in image array
      if (this.firstLoad) {
        this.unsplashImages = images;
        this.firstLoad=false;
      } else {
        //otherwise, add images to existing array
        this.unsplashImages = [...this.unsplashImages, ...images];
      }

      if (sessionStorage.getItem('unsplash-images') === null)
        sessionStorage.setItem('unsplash-images', JSON.stringify(images));
    });

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.imageStorage.getImagesFromApi(query, 'unsplash');

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
    if (
      this.unsplashImages.length === 0 &&
      sessionStorage.getItem('unsplash-images') !== null
    ) {
      this.unsplashImages = JSON.parse(
        sessionStorage.getItem('unsplash-images')
      );
    }
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }
}
