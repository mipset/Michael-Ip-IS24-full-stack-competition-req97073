import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataTableService } from '../data-table.service';

@Component({
  selector: 'app-add-product-popup',
  templateUrl: './add-product-popup.component.html',
  styleUrls: ['./add-product-popup.component.css'],
})
export class AddProductPopupComponent {
  constructor(
    private dataTableService: DataTableService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProductPopupComponent>
  ) {}

  newProductForm: FormGroup = new FormGroup({});
  hasError: boolean = false;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.newProductForm = this.fb.group({
      productName: ['', [Validators.required]],
      productOwner: ['', [Validators.required]],
      scrumMaster: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      methodology: ['', [Validators.required]],
      developers: this.fb.array([]),
    });
    this.addDeveloper();
  }

  get developers() {
    return this.newProductForm.controls['developers'] as FormArray;
  }

  addDeveloper() {
    if (this.developers.length > 4) {
      return;
    }
    const newDeveloper = this.fb.group({
      developers: ['', [Validators.required]],
    });
    this.developers.push(newDeveloper);
  }

  removeDeveloper(i: number) {
    if (this.developers.length<2){
      return;
    }
    this.developers.removeAt(i);
  }
  checkValidText(x: any) {
    if (!/^[a-zA-Z ]*$/.test(x.target.value)) {
      this.hasError = true;
    }
    else{
      this.hasError = false;
    }
  }

  addProduct() {
    let parseDevelopers: string[] = [];
    if (this.newProductForm.invalid) {
      return
    } else {
      console.log(this.newProductForm);

      for (let i = 0; i < this.newProductForm.value.developers.length; i++) {
        parseDevelopers.push(
          this.newProductForm.value.developers[i].developers
        );
      }
      let formattedDate = formatDate(new Date(this.newProductForm.value.startDate), "yyyy/MM/dd", 'en')
      let newProduct = {
        productId: '',
        productName: this.newProductForm.value.productName,
        productOwnerName: this.newProductForm.value.productOwner,
        developers: parseDevelopers,
        scrumMasterName: this.newProductForm.value.scrumMaster,
        startDate: formattedDate,
        methodology: this.newProductForm.value.methodology,
      };
      console.log(newProduct);
      this.dialogRef.close(newProduct);
    }
  }
}
