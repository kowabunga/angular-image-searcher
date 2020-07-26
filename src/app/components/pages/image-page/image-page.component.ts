import { Component, OnInit } from '@angular/core';
import { Image } from 'src/app/models/image';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss'],
})
export class ImagePageComponent implements OnInit {
  type: string;
  image: Image;
  images: Image[];
  tags: string[];
  faArrowCircleLeft = faArrowCircleLeft;
  faHeart = faHeart;
  faDownload = faDownload;
  faBookmark = faBookmark;
  faTag = faTag;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('ran');
    let id = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
    this.getImageFromTypeAndId(this.type, id);
  }

  // @TODO Add items to session storage
  // @TODO Get items from session storage
  getImageFromTypeAndId(type: string, id: string) {
    // We know that there should be images in session storage if we've navigated here, but we'll check each time we get here just in case
    switch (type) {
      case 'pexels':
        if (sessionStorage.getItem('pexel-images') !== null)
          this.images = JSON.parse(sessionStorage.getItem('pexel-images'));
        this.image = this.images.filter((image) => image.id === id)[0];
        break;

      case 'pixabay':
        if (sessionStorage.getItem('pixabay-images') !== null)
          this.images = JSON.parse(sessionStorage.getItem('pixabay-images'));

        this.image = this.images.filter((image) => image.id === id)[0];
        this.getTags();

        break;

      case 'unsplash':
        if (sessionStorage.getItem('unsplash-images') !== null)
          this.images = JSON.parse(sessionStorage.getItem('unsplash-images'));

        this.image = this.images.filter((image) => image.id === id)[0];
        this.getTags();
        break;

      default:
        break;
    }
  }

  getTags() {
    switch (this.type) {
      case 'pixabay':
        this.tags = this.image.tagStr.split(',');
        this.tags.forEach((tag) => tag.trim());
        break;

      case 'unsplash':
        this.tags = this.image.tagArr.map((tag) => tag['title']);

      default:
        break;
    }
  }
}
