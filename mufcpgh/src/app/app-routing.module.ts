import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {PhotoGalleryComponent} from "./photo-gallery/photo-gallery.component";
import {AboutUsComponent} from "./about-us/about-us.component";

const routes: Routes = [
  { path: 'photos', component: PhotoGalleryComponent },
  { path: '', component: HomePageComponent },
  { path: 'about-us', component: AboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
