import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageHistoryService {
  constructor(private router: Router) {}

  setCurrentPage(): void {
    console.log(this.router.url);
    sessionStorage.setItem('page', this.router.url);
  }

  getPrevPageFromSessionStorage(): string {
    if (sessionStorage.getItem('page') !== null) {
      return sessionStorage.getItem('page');
    }
  }

  getOldQuery(): string {
    let url = this.getPrevPageFromSessionStorage();
    url = url.replace(/\//g, '');

    const searchParam = sessionStorage.getItem(`old-${url}-query`);

    return searchParam;
  }
}
