import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {PhotoGalleryComponent} from "./photo-gallery/photo-gallery.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {NextGameComponent} from "./next-game/next-game.component";

const routes: Routes = [
  { path: 'photos', component: PhotoGalleryComponent },
  { path: '', component: HomePageComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'next-game', component: NextGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
