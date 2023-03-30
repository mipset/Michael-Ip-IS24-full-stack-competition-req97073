import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCloseDialogComponent } from '../confirm-close-dialog/confirm-close-dialog.component';
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
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddProductPopupComponent>
  ) { }

  newProductForm: FormGroup = new FormGroup({});
  hasError: boolean = false;

  ngOnInit() {

    this.dialogRef.backdropClick().subscribe(()=>{
      if(this.newProductForm.dirty){
        const closePopupDialog = this.dialog.open(ConfirmCloseDialogComponent,{
          disableClose: true
        })
        closePopupDialog.afterClosed().subscribe(result=>{
          if (result){
            this.dialogRef.close();
          }
          else{
            return;
          }
        })
      }
      else{
        this.dialogRef.close();
      }
    })
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
    if (this.developers.length < 2) {
      return;
    }
    this.developers.removeAt(i);
  }
  checkValidText(x: any) {
    if (!/^[a-zA-Z ]*$/.test(x.target.value)) {
      this.hasError = true;
    }
    else {
      this.hasError = false;
    }
  }

  addProduct() {
    let parseDevelopers: string[] = [];
    if (this.newProductForm.invalid || this.hasError) {
      this.newProductForm.markAllAsTouched();
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
      this.dialogRef.close(newProduct);
    }
  }

  confirmCancel() {
    if (this.newProductForm.dirty) {
      const closePopupDialog = this.dialog.open(ConfirmCloseDialogComponent, {
        disableClose: true
      })
      closePopupDialog.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close();
        }
        else {
          return;
        }
      })
    }
    else{
      this.dialogRef.close();
    }
  }
}
