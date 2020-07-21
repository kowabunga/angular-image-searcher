import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @Input() query: string;
  isHome: boolean = true;
  constructor(
    private imageStorage: ImageStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSearch(query) {
    this.router.navigate(['/pexels']);
  }
}
