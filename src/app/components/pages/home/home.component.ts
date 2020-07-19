import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isHome: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  handleClick(e) {
    console.log('Clicked');
  }
}
