import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  title = 'mufcpgh';

  navigateToPhotoGallery() {
    this.router.navigate(['/photos']);
  }

  navigateToHomeScreen() {
    this.router.navigate(['/']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us'])
  }

  navigateToNextGame() {
    this.router.navigate(['/next-game']);
  }
}
