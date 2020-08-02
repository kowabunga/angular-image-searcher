import { Component, OnInit, OnDestroy } from '@angular/core';
import { Image } from '../../../models/image';
import { ImageStorageService } from '../../../services/image-storage.service';
import { PageHistoryService } from '../../../services/page-history.service';

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
  pageNumber: number = 1;
  noPics: boolean = false;

  constructor(
    private imageStorage: ImageStorageService,
    private pageHistory: PageHistoryService
  ) {}
  ngOnInit(): void {
    if (sessionStorage.getItem('pexel-page-number') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('pexel-page-number'));
    }

    // Subscribe to query string behaviorsubject to get constant update of latest query value
    this.getQueryString = this.imageStorage.queryString.subscribe((query) => {
      this.queryString = query;

      //Grab old query string
      if (sessionStorage.getItem('old-pexels-query') !== null) {
        this.oldQueryString = sessionStorage.getItem('old-pexels-query');
      }

      if (this.queryString === '') {
        this.queryString = this.oldQueryString;
      }

      if (
        this.queryString !== '' &&
        this.queryString !== undefined &&
        this.queryString !== this.oldQueryString
      ) {
        sessionStorage.removeItem('pexels-images');
        this.imageStorage.getImagesFromApi(this.queryString, 'pexels');
      } else if (
        this.queryString === this.oldQueryString &&
        sessionStorage.getItem('pexels-images') !== null &&
        this.oldQueryString === this.getOldQuery()
      ) {
        console.log('this ran');
        this.queryString = this.oldQueryString;
        this.pexelsImages = JSON.parse(sessionStorage.getItem('pexels-images'));
        this.noPics = this.pexelsImages.length === 0;
      } else if (this.oldQueryString !== this.getOldQuery()) {
        const searchParam = this.getOldQuery();
        this.imageStorage.setQueryString(searchParam);
      }

      this.pageHistory.setCurrentPage();
    });

    // Subscribe to image array changes in image storage service and load said images into component image array
    this.getImages = this.imageStorage.pexelsImages.subscribe((images) => {
      // on initial component load, store images directly in image array
      // query string comparison is for when query changes. On query change, images should be replaced entirely by new query results
      if (this.queryString !== this.oldQueryString) {
        this.pexelsImages = images;
        this.oldQueryString = this.queryString;
        this.pageNumber = 1;

        sessionStorage.setItem('old-pexels-query', this.oldQueryString);

        sessionStorage.setItem('pexel-page-number', this.pageNumber.toString());

        sessionStorage.setItem(
          'pexels-images',
          JSON.stringify(this.pexelsImages)
        );
      } else {
        // otherwise, add images to existing array and update session storage
        this.pexelsImages = [...this.pexelsImages, ...images];

        sessionStorage.setItem(
          'pexels-images',
          JSON.stringify(this.pexelsImages)
        );
      }
      this.noPics = this.pexelsImages.length === 0;
    });
  }

  ngOnDestroy(): void {
    this.getQueryString.unsubscribe();
    this.getImages.unsubscribe();
  }

  loadPictures(): void {
    this.imageStorage.getImagesFromApi(
      this.queryString,
      'pexels',
      30,
      ++this.pageNumber
    );
    sessionStorage.setItem('pexel-page-number', this.pageNumber.toString());
  }

  getOldQuery(): string {
    let url = this.pageHistory.getPrevPageFromSessionStorage();
    url = url.replace(/\//g, '');

    const searchParam = sessionStorage.getItem(`old-${url}-query`);

    return searchParam;
  }
}
