import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { PexelsApiService } from '../../../services/pexels-api.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pexels',
  templateUrl: './pexels.component.html',
  styleUrls: ['./pexels.component.scss'],
})
export class PexelsComponent implements OnInit, OnDestroy {
  pexelsImages: Image[];
  getQueryString: any;
  queryString: string;
  getImages: any;

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {
    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage
      .getImages('pexels')
      .subscribe((images) => (this.pexelsImages = images));

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      if (query !== '') this.imageStorage.getImagesFromApi(query, 'pexels');

      this.queryString = query;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  // @TODO get rid of emit - probably not necessary
  onSearch(query): void {
    console.log(this.queryString);
    this.imageStorage.getImagesFromApi(this.queryString, 'pexels');
  }
}
