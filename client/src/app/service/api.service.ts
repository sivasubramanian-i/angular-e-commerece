import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { MessageService } from "./message.service";

import { AppConfig } from "@ecommerce/settings/app.config";

import { Errors } from "@ecommerce/models/errors.model";
import { Product } from "@ecommerce/models/product.model";

@Injectable({
  providedIn: "root"
})
export class APIService {
  public headers: HttpHeaders;
  public ecommerceRQSTOptions: any;

  constructor(
    private _appConfig: AppConfig,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  setEcommerceHeader() {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
      "Ecommerce-version": "1.0.0"
    });
    this.ecommerceRQSTOptions = {
      headers: this.headers,
      responseType: "json"
    };
  }
  /**
   * Get site content
   */
  getContent() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CONTENT_PATH}`;
      return this.http
        .get<{ content: any }>(apiURL)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
    return promise;
  }

  /**
   * Get error message
   */
  getErrorMessage() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.ERROR_MSG_PATH}`;
      return this.http
        .get<{ srverrors: Errors }>(apiURL)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
    return promise;
  }

  getProducts(): Observable<Product[]> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_PRODUCT_LIST_PATH}`;
    return this.http
      .get<Product[]>(apiURL)
      .pipe(
        map(response =>
          response["products"].map((product: Product) =>
            new Product().deserialize(product)
          )
        )
      );
  }

  /**
   * Get product details
   */
  getProductDetails(id: string): Observable<Product> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_PRODUCT_DETAILS_PATH}`;
    const authData = { productid: id };
    return this.http
      .post<Product>(apiURL, authData)
      .pipe(
        map(response => new Product().deserialize(response["productinfo"]))
      );
  }

  /**
   * Check product availability in cart
   */
  isAvailableInCart(email): Observable<any> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CART_CHECK_PRODUCT}`;
    const authData = { email: email };
    return this.http.post(apiURL, authData, this.ecommerceRQSTOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Add to cart details
   */
  addToCart(sessionInfoDt, productInfoDt): Observable<any> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CART_PATH}`;
    const authData = {
      sessionInfo: sessionInfoDt,
      productsInfo: productInfoDt
    };
    return this.http.post(apiURL, authData, this.ecommerceRQSTOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Add product quantity to buy
   */
  productAddToBuy(email, id, price, qty): Observable<any> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CART_ADD_PRODUCT_QUANTITY}`;
    const authData = { email: email, id: id, price: price, qty: qty };
    return this.http.post(apiURL, authData, this.ecommerceRQSTOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Delete product quantity to buy
   */
  productDeleteToBuy(email, id, price, qty): Observable<any> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CART_DELETE_PRODUCT_QUANTITY}`;
    const authData = { email: email, id: id, price: price, qty: qty };
    return this.http.post(apiURL, authData, this.ecommerceRQSTOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Remoe product from cart
   */
  productRemoveFromCart(email, id): Observable<any> {
    const apiURL = `${this._appConfig.apiEndpoint}${this._appConfig.API_CART_REMOVE_PRODUCT}`;
    const authData = { email: email, id: id };
    return this.http.post(apiURL, authData, this.ecommerceRQSTOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
}
