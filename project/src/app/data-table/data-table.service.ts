import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductModel } from './product-model';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class DataTableService {
  constructor(private http: HttpClient) {}

  getProductList() {
    return this.http.get<{ message: string; productList: ProductModel[] }>(
      `${BACKEND_URL}/products/getProductList`
    );
  }

  addProduct(newProduct: ProductModel) {
    this.http.post(`${BACKEND_URL}/products/addProduct`, newProduct).subscribe({
      next: (response) => console.log(response),
      error: (err) => {
        alert(
          'Something went wrong with adding a product. Please check logs or try again'
        );
        console.log(err);
      },
    });
  }
}
