import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductModel } from './product-model'

const BACKEND_URL = environment.apiUrl ;

@Injectable({providedIn: 'root'})

export class DataTableService{
  constructor(private http: HttpClient) {}

  getProductList(){
    return this.http.get<{message: string, productList: ProductModel[]}>(`${BACKEND_URL}/products/getProductList`)
  }
}
