import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../../../models/image';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  @Input() gallery: Image[];
  @Input() prevLocation: string;

  constructor() {}

  ngOnInit(): void {
  }
}
