import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataTableService } from '../data-table.service';

@Component({
  selector: 'app-add-product-popup',
  templateUrl: './add-product-popup.component.html',
  styleUrls: ['./add-product-popup.component.css']
})
export class AddProductPopupComponent {
  constructor(private dataTableService: DataTableService, private fb: FormBuilder, public dialogRef: MatDialogRef<AddProductPopupComponent>) { }

  newProductForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.initializeForm();

  }

  initializeForm() {
    this.newProductForm = this.fb.group({
      productName: [''],
      productOwner: [''],
      scrumMaster: [''],
      startDate: [''],
      methodology: [''],
      developers: this.fb.array([])
    })
    this.addDeveloper();
  }

  get developers() {
    return this.newProductForm.controls["developers"] as FormArray;
  }


  addDeveloper(){
    if(this.developers.length>4){
      alert("limit 5 developers");
      return;
    }
    const newDeveloper = this.fb.group({
      developers: ['']
    });
    this.developers.push(newDeveloper);
  }
  checkValidText(x: any) {
    console.log(x);
    if (!/^[a-zA-Z ]*$/.test(x.target.value)) {
      console.log("Letters Only Please");
    }
  }

  addProduct() {
    if (this.newProductForm.invalid) {
      alert("Missing Fields");
    }
    else {
      console.log(this.newProductForm);
      let newProduct = {
        productId: "",
        productName: this.newProductForm.value.productName,
        productOwnerName: this.newProductForm.value.productOwner,
        developers: this.newProductForm.value.developers,
        scrumMasterName: this.newProductForm.value.scrumMaster,
        startDate: this.newProductForm.value.startDate,
        methodology: this.newProductForm.value.methodology
      }
      console.log(newProduct)
      this.dialogRef.close(newProduct);
    }
  }
}
