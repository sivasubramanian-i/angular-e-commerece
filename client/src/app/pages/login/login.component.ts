import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
import { Router, ActivationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { PlatformConfig } from "@ecommerce/settings/platform.config";
import { ILogin } from "@ecommerce/interfaces/login";
import { AuthService } from "@ecommerce/auth/auth.service";
import { SharedService } from "@ecommerce/service/shared.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ecommerce-login",
  templateUrl: "./login.component.html",
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit, OnDestroy {
  user: {};
  isLoading: Boolean = true;
  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  submitted = false;
  errorData: any;
  token: string;
  custEmail: string;
  custName: string;
  authLoggedInStatus: Subscription;
  content = [];
  formFields = [];

  constructor(
    private _platformConfig: PlatformConfig,
    private titleService: Title,
    private router: Router,
    public authService: AuthService,
    private sharedService: SharedService,
    private el: ElementRef
  ) {
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe(event => {
        this.titleService.setTitle("Login Page");
      });
  }

  ngOnInit() {
    if (this._platformConfig.isBrowser) {
      this.siteContent();
    }
  }

  async siteContent() {
    try {
      // "await" will wait for the promise to resolve or reject
      // if it rejects, an error will be thrown, which you can
      // catch with a regular try/catch block
      await this.sharedService.content.subscribe(res => {
        console.log(res.content[0]["loginPage"], "res======");
        this.content =
          res.content[0] && res.content[0]["loginPage"]
            ? res.content[0]["loginPage"]
            : res["loginPage"];
        this.formFields = this.content["formFields"];
        console.log(this.content);
        this.isLoading = false;
      });
    } catch (error) {
      this.errorData = this.sharedService.getErrorKeys(error.statusText);
      console.log(this.errorData);
    }
  }

  getFormValue(formVal) {
    console.log("Login Form Value => ", formVal);
    this.login({ value: formVal, valid: true });
  }

  login({ value, valid }: { value: ILogin; valid: boolean }) {
    this.submitted = true;
    const invalidElements = this.el.nativeElement.querySelectorAll(
      ".form-control.ng-invalid"
    );
    console.log(invalidElements, invalidElements.length);
    if (invalidElements.length > 0) {
      console.log(invalidElements[0]);
      invalidElements[0].focus();
    } else {
      this.authService.loginCustomer(value);
    }
  }

  ngOnDestroy() {}
}
