import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() query: EventEmitter<string> = new EventEmitter();

  faSearch = faSearch; // Font awesome icon
  searchParam: string = '';

  constructor(
    private pexels: PexelsApiService,
    private unsplash: UnsplashApiService,
    private pixabay: PixabayApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(queryValue) {
    if (queryValue.length > 0) this.query.emit(queryValue);
  }
}
