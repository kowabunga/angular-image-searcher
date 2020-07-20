import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() isHome;
  @Output() query: EventEmitter<boolean> = new EventEmitter();

  faSearch = faSearch; // Font awesome icon
  searchParam: string = '';

  constructor(private imageStorage: ImageStorageService) {}

  ngOnInit(): void {}

  onSubmit(queryValue): void {
    this.imageStorage.setQueryString(queryValue);
    if (queryValue.length > 0) this.query.emit(true);
  }
}
