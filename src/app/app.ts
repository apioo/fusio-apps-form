import {Component, OnInit, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {BackendUser} from "fusio-sdk";
import {UserService} from "ngx-fusio-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  styleUrl: './app.css'
})
export class App implements OnInit {
  user = signal<BackendUser|undefined>(undefined);

  constructor(private userMeta: UserService) { }

  ngOnInit(): void {
    this.user.set(this.userMeta.get());
  }

}

declare global {
  var FUSIO_URL: string | undefined;
  var FUSIO_APP_KEY: string | undefined;
}
