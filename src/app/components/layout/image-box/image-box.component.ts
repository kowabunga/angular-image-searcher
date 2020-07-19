import { Component, OnInit, Input } from '@angular/core';
import { Image } from 'src/app/models/image';

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnInit {
  @Input() image: Image;
  @Input() type: string;

  constructor() {}

  ngOnInit(): void {}
}
