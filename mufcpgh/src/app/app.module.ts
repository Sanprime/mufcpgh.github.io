import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { HomePageComponent } from './home-page/home-page.component';
import { LinkTreeComponent } from './home-page/link-tree/link-tree.component';
import { FooterComponent } from './footer/footer.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import {HttpClientModule} from "@angular/common/http";
import { AboutUsComponent } from './about-us/about-us.component';
import { NextGameComponent } from './next-game/next-game.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LinkTreeComponent,
    FooterComponent,
    PhotoGalleryComponent,
    AboutUsComponent,
    NextGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
