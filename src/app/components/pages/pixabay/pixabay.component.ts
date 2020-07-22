import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { PixabayApiService } from 'src/app/services/pixabay-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pixabay',
  templateUrl: './pixabay.component.html',
  styleUrls: ['./pixabay.component.scss'],
})
export class PixabayComponent implements OnInit, OnDestroy {
  pixabayImages: Image[];
  getQueryString: any;
  queryString: string;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage
      .getImages('pixabay')
      .subscribe((images) => (this.pixabayImages = images));

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      if (query !== '') this.imageStorage.getImagesFromApi(query, 'pixabay');

      this.queryString = query;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  onSearch(query): void {
    console.log(this.queryString);
    this.imageStorage.getImagesFromApi(this.queryString, 'pixabay');
  }
}
