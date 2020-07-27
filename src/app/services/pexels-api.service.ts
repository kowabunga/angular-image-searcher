import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: environment.PEXELS_API,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PexelsApiService {
  constructor(private http: HttpClient) {}

  getPexelImages(query: string, perPage:number): Observable<any> {
    return this.http.get<any>(
      `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`,
      httpOptions
    );
  }
}
