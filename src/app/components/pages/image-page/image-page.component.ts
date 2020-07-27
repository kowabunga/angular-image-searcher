import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from 'src/app/models/image';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss'],
})
export class ImagePageComponent implements OnInit {
  type: string;
  prevLocation: string;
  image: Image;
  tags: string[];
  faArrowCircleLeft = faArrowCircleLeft;
  faHeart = faHeart;
  faDownload = faDownload;
  faBookmark = faBookmark;
  faTag = faTag;

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.type = this.router.snapshot.params.type;
    this.image = history.state.image;
    this.prevLocation = history.state.prevLocation;
    console.log(history.state);
    if (this.image.type === 'pixabay' || this.image.type === 'unsplash') {
      this.getTags();
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
