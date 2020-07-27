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
  constructor(
    private imageStorage: ImageStorageService,
    private router: Router
  ) {}

  // Load some random images on initial page load
  ngOnInit(): void {
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
}
