import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { Image } from '../../../models/image';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  getImages: any = [];
  isHome: boolean = true;
  images: Image[] = [];
  pageNumber: number = 1;
  constructor(
    private imageStorage: ImageStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('home-page-number') !== null) {
      this.pageNumber = parseInt(sessionStorage.getItem('home-page-number'));
    }

    // Subscribe to image array changes
    this.getImages.push(
      this.imageStorage.pexelsImages.subscribe((images) => {
        this.images = [...this.images, ...images];
      })
    );
    this.getImages.push(
      this.imageStorage.unsplashImages.subscribe((images) => {
        this.images = [...this.images, ...images];
      })
    );
    this.getImages.push(
      this.imageStorage.pixabayImages.subscribe((images) => {
        this.images = [...this.images, ...images];
      })
    );

    // Make api calls
    this.imageStorage.getImagesFromApi('random', 'pexels', 10);
    this.imageStorage.getImagesFromApi('random', 'pixabay', 10);
    this.imageStorage.getImagesFromApi('random', 'unsplash', 10);
  }

  ngOnDestroy(): void {
    this.getImages.forEach((image) => image.unsubscribe());
  }

  onSearch(query) {
    this.router.navigate(['/pexels']);
  }

  loadPictures(): void {
    ++this.pageNumber;
    this.imageStorage.getImagesFromApi('random', 'pexels', 10, this.pageNumber);
    this.imageStorage.getImagesFromApi(
      'random',
      'pixabay',
      10,
      this.pageNumber
    );
    this.imageStorage.getImagesFromApi(
      'random',
      'unsplash',
      10,
      this.pageNumber
    );
    sessionStorage.setItem('home-page-number', this.pageNumber.toString());
  }
}
