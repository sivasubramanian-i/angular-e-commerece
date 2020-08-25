import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ProductListComponent } from "./product-list.component";

import { ProductModule } from "../products.module";

const routes: Routes = [
  {
    path: "",
    component: ProductListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductListComponent]
})
export class ProductListModule {}
