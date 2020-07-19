import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PexelsApiService } from '../../services/pexels-api.service';
import { UnsplashApiService } from '../../services/unsplash-api.service';
import { PixabayApiService } from '../../services/pixabay-api.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() isHome;

  faSearch = faSearch; // Font awesome icon
  searchParam: string = '';

  constructor(
    private pexels: PexelsApiService,
    private unsplash: UnsplashApiService,
    private pixabay: PixabayApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(query: string) {
    // On submit, we make the appropriate api calls based on the url link we are in.
    const urlRoute = this.router.url;

    switch (urlRoute) {
      case '/':
        break;
      case '/pexels':
        break;
      case '/unsplash':
        break;
      case '/pixabay':
        break;
      default:
        break;
    }
  }
}
