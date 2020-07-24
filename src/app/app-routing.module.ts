import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { PexelsComponent } from './components/pages/pexels/pexels.component';
import { PixabayComponent } from './components/pages/pixabay/pixabay.component';
import { UnsplashComponent } from './components/pages/unsplash/unsplash.component';
import { ImagePageComponent } from './components/pages/image-page/image-page.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pexels', component: PexelsComponent },
  { path: 'pixabay', component: PixabayComponent },
  { path: 'unsplash', component: UnsplashComponent },
  { path: 'image/:type/:id', component: ImagePageComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
