import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpErrorInterceptor } from "./service/http-error-interceptor";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";
import { AuthInterceptor } from "./auth/auth-interceptor";

import { HeaderModule } from "./shared/components/header/header.module";

import { APIService } from "./service/api.service";
import { AuthService } from "./auth/auth.service";

import { ProductsComponent } from "./pages/products/products.component";
// import { ServiceWorkerModule } from "@angular/service-worker";
// import { environment } from "../environments/environment";

@NgModule({
  declarations: [AppComponent, ProductsComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    APIService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
