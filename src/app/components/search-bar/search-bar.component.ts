import { Component, OnInit, ViewChild } from '@angular/core';
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
  faSearch = faSearch; // Font awesome icon
  searchParam: string = '';

  constructor(
    private pexels: PexelsApiService,
    private unsplash: UnsplashApiService,
    private pixabay: PixabayApiService
  ) {}

  ngOnInit(): void {}

  onSubmit() {}
}
