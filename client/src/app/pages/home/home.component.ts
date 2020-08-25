import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivationEnd } from "@angular/router";
import { filter, map, flatMap } from "rxjs/operators";
import { PlatformConfig } from "@ecommerce/settings/platform.config";
import { APIService } from "@ecommerce/service/api.service";
import { SharedService } from "@ecommerce/service/shared.service";

@Component({
  selector: "ecommerce-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  slideCt = [];
  isLoading: Boolean = true;
  errorData: any;

  constructor(
    private _platformConfig: PlatformConfig,
    private router: Router,
    private titleService: Title,
    private apiService: APIService,
    private sharedService: SharedService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe(event => {
        this.titleService.setTitle("Home Page");
      });
  }

  ngOnInit() {
    if (this._platformConfig.isBrowser) {
      this.sliderContent();
    }
  }

  async sliderContent() {
    try {
      // "await" will wait for the promise to resolve or reject
      // if it rejects, an error will be thrown, which you can
      // catch with a regular try/catch block
      await this.sharedService.content.subscribe(res => {
        let sliderObj = [
          {
            title: "Los Angeles",
            caption: "We had such a great time in LA!",
            url:
              "https://demo.themedelights.com/Wordpress/WP01/WP004/wp-content/uploads/2019/03/Main_Banner-1-1.jpg"
          },
          {
            title: "Chicago",
            caption: "Thank you, Chicago!",
            url:
              "https://demo.themedelights.com/Wordpress/WP01/WP004/wp-content/uploads/2019/03/Main_Banner-2-1.jpg"
          }
        ];

        this.slideCt = sliderObj;
        this.isLoading = false;
      });
    } catch (error) {
      this.errorData = this.sharedService.getErrorKeys(error.statusText);
      this.isLoading = false;
      console.log("errorData => ", this.errorData);
    }
  }
}
