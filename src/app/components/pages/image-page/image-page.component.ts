import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from 'src/app/models/image';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faUnsplash } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss'],
})
export class ImagePageComponent implements OnInit {
  type: string;
  id: string;
  prevLocation: string;
  image: Image;
  images: Image[];
  tags: string[];
  faArrowCircleLeft = faArrowCircleLeft;
  faDownload = faDownload;
  faBookmark = faBookmark;
  faUnsplash = faUnsplash;
  faHeart = faHeart;
  faTag = faTag;

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.type = this.router.snapshot.params.type;
    this.id = this.router.snapshot.params.id;

    if (sessionStorage.getItem('prev-location') !== null) {
      this.prevLocation = sessionStorage.getItem('prev-location');
    }

    this.image = this.getImageFromSessionStorage(this.type, this.id);
    if (this.type === 'pixabay' || this.type === 'unsplash') {
      this.getTags();
    }
  }

  getImageFromSessionStorage(type: string, id: string): Image {
    if (this.prevLocation === 'home') {
      this.images = JSON.parse(sessionStorage.getItem('home-images'));
    } else {
      this.images = JSON.parse(sessionStorage.getItem(`${type}-images`));
    }

    let retrievedImage: Image = null;
    this.images.forEach((image) => {
      if (image.id === id) {
        retrievedImage = image;
      }
    });

    return retrievedImage;
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
