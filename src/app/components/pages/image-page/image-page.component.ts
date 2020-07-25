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
  tags: string[];
  faArrowCircleLeft = faArrowCircleLeft;
  faHeart = faHeart;
  faDownload = faDownload;
  faBookmark = faBookmark;
  faTag = faTag;

  constructor(
    private route: ActivatedRoute,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    console.log('ran');
    let id = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
    // this.getImageFromTypeAndId(this.type, id);
  }

  // @TODO Add items to session storage
  // @TODO Get items from session storage
  // getImageFromTypeAndId(type: string, id: string) {
  //   switch (type) {
  //     case 'pexels':
  //       this.imageStorage.getImages(type).subscribe((images) => {
  //         console.log(images);
  //         this.image = images.filter((image) => image.id === id)[0];
  //       });
  //       break;

  //     case 'pixabay':
  //       this.imageStorage.getImages(type).subscribe((images) => {
  //         console.log(images);

  //         this.image = images.filter((image) => image.id === id)[0];
  //         this.getTags();
  //       });
  //       break;

  //     case 'unsplash':
  //       this.imageStorage.getImages(type).subscribe((images) => {
  //         console.log(images);

  //         this.image = images.filter((image) => image.id === id)[0];
  //         this.getTags();
  //       });
  //       break;

  //     default:
  //       break;
  //   }
  // }

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
