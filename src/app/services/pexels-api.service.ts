import { Injectable } from '@angular/core';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root',
})
export class PexelsApiService {
  pexelsImages: Image[];
  constructor() {}
}
