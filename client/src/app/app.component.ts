import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  Inject,
  OnChanges
} from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { PlatformConfig } from "@ecommerce/settings/platform.config";
import { APIService } from "@ecommerce/service/api.service";
import { SharedService } from "@ecommerce/service/shared.service";
import { AuthService } from "./auth/auth.service";
import { Subscription, from } from "rxjs";
import { Constants } from "./constants/constants";
import { MetaTags } from "./enums/meta-tags";
import { MessageService } from "@ecommerce/service/message.service";
import { LocalObject } from "./local-object";

@Component({
  selector: "ecommerce-root",
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  isLoading: Boolean = true;
  custIsAuthenticated = false;
  custName: string;
  private authListenerSubs: Subscription;
  private subscription: Subscription;
  content: any;
  errorData: any;
  alertMsg: any;
  localObject: any;

  constructor(
    private _platformConfig: PlatformConfig,
    private titleService: Title,
    private meta: Meta,
    private apiService: APIService,
    private authService: AuthService,
    private sharedService: SharedService,
    private constants: Constants,
    private msgService: MessageService,
    @Inject(DOCUMENT) private doc
  ) {
    this.localObject = new LocalObject();
  }

  ngOnInit() {
    if (this._platformConfig.isBrowser) {
      this.setPageTitle();
      this.createLinkForCanonicalURL();
      this.authService.autoAuthCust();
      this.checkAuthentication();
      this.showMsgAlert();
      this.callLocalObject();
    }
  }

  ngOnChanges() {
    this.checkAuthentication();
    this.showMsgAlert();
  }

  callLocalObject() {
    if (this.localObject.getData() === null) {
      this.siteContent();
    } else {
      this.content = this.localObject.getData();
      this.storeLocalObjectDataInService();
      this.isLoading = false;
    }
  }

  siteContent() {
    try {
      Promise.all([this.apiService.getContent()]).then(res => {
        console.log("Promise all => ", res);
        const arrjoin = Object.assign({}, res[0], res[1]);
        console.log("Join = ", arrjoin);
        this.localObject.setData(
          arrjoin
        ); /* store site content data in localstorage */
        this.storeLocalObjectDataInService();
        this.isLoading = false;
      });
    } catch (error) {
      this.errorData = this.sharedService.getErrorKeys(error.statusText);
      this.isLoading = false;
      console.log(this.errorData);
    }
  }

  storeLocalObjectDataInService() {
    this.content = this.localObject.getData().content[0];
    console.log("this.content => ", this.content);
    this.sharedService.setSiteContent(this.content);
  }

  setPageTitle() {
    // this.titleService.setTitle(this.constants["title"]);
    // this.meta.addTag({ name: "keywords", content: MetaTags["keywords"] });
    // this.meta.addTag({ name: "description", content: MetaTags["description"] });
    // this.meta.addTag({ name: "author", content: MetaTags["author"] });
    // this.meta.addTag({ name: "robots", content: MetaTags["robots"] });
  }

  createLinkForCanonicalURL() {
    const link: HTMLLinkElement = this.doc.createElement("link");
    link.setAttribute("rel", "canonical");
    this.doc.head.appendChild(link);
    link.setAttribute("href", this.doc.URL);
  }

  checkAuthentication() {
    this.custName = this.authService.getCustName()[0];
    this.custIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getLoggedInStatusListener()
      .subscribe(isAuthenticated => {
        this.custIsAuthenticated = isAuthenticated;
        this.custName = this.authService.getCustName()[0];
        console.log(
          "Header Details => ",
          this.custIsAuthenticated,
          this.custName
        );
      });
  }

  showMsgAlert() {
    this.subscription = this.msgService.getMessage().subscribe(message => {
      this.alertMsg = message;
      console.log("showMsgAlert => ", this.alertMsg);
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
