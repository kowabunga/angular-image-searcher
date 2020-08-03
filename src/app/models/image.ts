export class Image {
  id: string;
  type: string;
  imageSmall: string;
  imageLarge: string;
  pageUrl: string;
  photographer: string;
  photographerUrl: string;
  likes?: number;
  downloads?: number;
  favorites?: number;
  tagStr: string;
  tagArr?: [];

  constructor(image, type) {
    switch (type) {
      case 'pexels':
        this.id = image.id.toString();
        this.type = type;
        this.imageSmall = image.src.medium;
        this.imageLarge = image.src.original;
        this.pageUrl = image.url;
        this.photographer = image.photographer;
        this.photographerUrl = image.photographer_url;
        break;
      case 'pixabay':
        //pixabay has:
        //comments,downloads,favorites,likes,
        this.id = image.id.toString();
        this.type = type;
        this.imageSmall = image.webformatURL.replace('_640', '_340');
        this.imageLarge = image.largeImageURL;
        this.pageUrl = image.pageURL;
        this.photographer = image.user;
        this.photographerUrl = `https://pixabay.com/users/${image.user}-${image.user_id}/`;
        this.downloads = image.downloads;
        this.favorites = image.favorites;
        this.likes = image.likes;
        this.tagStr = image.tags;
        break;
      case 'unsplash':
        //unsplash has
        // likes, tags,
        this.id = image.id.toString();
        this.type = type;
        this.imageSmall = image.urls.small;
        this.imageLarge = image.urls.raw;
        this.pageUrl = `${image.links.html}/?utm_source=AngularImageSearcher&utm_medium=referral`;
        this.photographer = image.user.name;
        this.photographerUrl = `${image.user.links.html}/?utm_source=AngularImageSearcher&utm_medium=referral`;
        this.likes = image.likes;
        this.tagArr = image.tags;
        break;
      default:
        break;
    }
  }

  // Changes webformat image from default 640px height to 340px height
  changeWebFormatUrl(url: string): string {
    return url.replace('_640', '_340');
  }
}
