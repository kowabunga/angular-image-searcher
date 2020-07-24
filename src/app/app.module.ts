import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ImageBoxComponent } from './components/layout/image-box/image-box.component';
import { ImageGalleryComponent } from './components/layout/image-gallery/image-gallery.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { PageHeaderComponent } from './components/layout/page-header/page-header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PexelsComponent } from './components/pages/pexels/pexels.component';
import { PixabayComponent } from './components/pages/pixabay/pixabay.component';
import { UnsplashComponent } from './components/pages/unsplash/unsplash.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImagePageComponent } from './components/pages/image-page/image-page.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageBoxComponent,
    ImageGalleryComponent,
    NavbarComponent,
    PageHeaderComponent,
    HomeComponent,
    PexelsComponent,
    PixabayComponent,
    UnsplashComponent,
    SearchBarComponent,
    ImagePageComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
