export class Image {
  id: string;
  imageSmall: string;
  imageLarge: string;
  pageUrl: string;
  photographer: string;
  photographerUrl?: string;

  constructor(image, type) {
    switch (type) {
      case 'pexels':
        this.id = image.id;
        this.imageSmall = image.src.medium;
        this.imageLarge = image.src.original;
        this.pageUrl = image.url;
        this.photographer = image.photographer;
        this.photographerUrl = image.photographer_url;
        break;
      case 'pixabay':
        this.id = image.id;
        this.imageSmall = image.webformatURL;
        this.imageLarge = image.largeImageURL;
        this.pageUrl = image.pageURL;
        this.photographer = image.user;
        break;
      //pixabay does not provide a link to the photographers page in its api
      case 'unsplash':
        this.id = image.id;
        this.imageSmall = image.urls.small;
        this.imageLarge = image.urls.raw;
        this.pageUrl = image.links.html;
        this.photographer = image.user.name;
        this.photographerUrl = image.user.links.html;
        break;
      default:
        break;
    }
  }
}
