import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginGuard } from "./auth/login.guard";
import { Constants } from "./constants/constants";

const appRoutes: Routes = [
  {
    path: "",
    loadChildren: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadChildren: "./pages/home/home.module#HomeModule"
  },
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginModule",
    canActivate: [LoginGuard]
  },
  {
    path: "register",
    loadChildren: "./pages/register/register.module#RegisterModule",
    canActivate: [LoginGuard]
  },
  {
    path: "products",
    loadChildren:
      "./pages/products/product-list/product-list.module#ProductListModule"
  },
  {
    path: "product/details/:id",
    loadChildren:
      "./pages/products/product-details/product-details.module#ProductDetailsModule"
  },
  {
    path: "cart",
    loadChildren: "./pages/cart/cart.module#CartModule",
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    loadChildren: "",
    redirectTo: "home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard, LoginGuard, Constants]
})
export class AppRoutingModule {}
