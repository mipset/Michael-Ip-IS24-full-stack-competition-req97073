import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { DataTableService } from './data-table.service';
import { AddProductPopupComponent } from './add-product-popup/add-product-popup.component';
import { ProductModel } from './product-model'

// function autocompleteObjectValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     if (typeof control.value === 'string') {
//       return { 'invalidAutocompleteObject': { value: control.value } }
//     }
//     return null  /* valid option selected */
//   }
// }

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})



export class DataTableComponent implements OnInit {

  displayedColumns: string[] = ['productId', 'productName', 'productOwnerName', 'developers', 'scrumMasterName', 'startDate', 'methodology'];
  frontendData: ProductModel[] = [];
  tableData: any;
  scrumMasterList: string[] = [];
  developerList: string[] = [];
  filteredListForScrumMaster!: Observable<any[]>;
  filteredListForDevelopers!: Observable<any[]>;
  filterOptionsForm: FormGroup = new FormGroup({});
  productLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private dataTableService: DataTableService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.filterOptionsForm = this.fb.group({
      scrumMasterFilter: [''],
      developerFilter: ['']
    })
    this.initialDataLoad();
  }

  initialDataLoad() {
    this.dataTableService.getProductList().subscribe((backendData) => {
      this.frontendData = backendData.productList
      this.tableData = new MatTableDataSource(this.frontendData)
      console.log(this.tableData);
      this.productLength = this.tableData.filteredData.length;
      this.tableData.paginator = this.paginator;
      this.sortFilterLists(this.tableData.filteredData);
      this.loadAutoComplete();
    });
  }

  loadAutoComplete() {
    this.filteredListForScrumMaster = this.scrumFieldControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value;
        return name ? this._filterScrumMaster(name as string) : this.scrumMasterList.slice();
      }),
    );
    this.filteredListForDevelopers = this.developerFieldControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value;
        return name ? this._filterDevelopers(name as string) : this.developerList.slice();
      }),
    );
  }
  get scrumFieldControl() {
    return this.filterOptionsForm.get('scrumMasterFilter') as FormControl
  }
  get developerFieldControl() {
    return this.filterOptionsForm.get('developerFilter') as FormControl
  }
  private _filterScrumMaster(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.scrumMasterList.filter(name => name.toLowerCase().includes(filterValue));
  }
  private _filterDevelopers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.developerList.filter(name => name.toLowerCase().includes(filterValue));
  }



  sortFilterLists(tableData: any) {
    this.scrumMasterListFilter(tableData);
    this.developerListFilter(tableData);
  }
  scrumMasterListFilter(tableData: any) {
    for (let i = 0; i < tableData.length; i++) {
      this.scrumMasterList.push(tableData[i].scrumMasterName);
    };
  }
  developerListFilter(tableData: any) {
    for (let i = 0; i < tableData.length; i++) {
      for (let x = 0; x < tableData[i].developers.length; x++) {
        this.developerList.push(tableData[i].developers[x]);
      }
    }
  }

  filterTable(event: MatAutocompleteSelectedEvent){
    console.log(event.option.value);
    this.tableData.filter = event.option.value.trim().toLowerCase();
    console.log(this.tableData);
    this.productLength = this.tableData.filteredData.length;
  }

  resetFilters(){
    this.filterOptionsForm.get('scrumMasterFilter')?.setValue('');
    this.filterOptionsForm.get('developerFilter')?.setValue('');
    this.tableData.filter = "";
    this.productLength = this.tableData.filteredData.length;
  }

  addProduct(){
    const addProductPopup = this.dialog.open(AddProductPopupComponent, {disableClose:true});
    addProductPopup.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        // this.adminService.updateUserRequestData(
        //   user.userId,
        //   user.tenderId
        // );
        // this.updateLocalCache(user);
        // this.Requested--;
        // this.Fulfilled++;
      });
  }


}


