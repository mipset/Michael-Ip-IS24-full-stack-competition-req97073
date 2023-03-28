import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { DataTableService } from './data-table.service';
import { AddProductPopupComponent } from './add-product-popup/add-product-popup.component';
import { ProductModel } from './product-model';
import { MatSort, Sort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
  styleUrls: ['./data-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DataTableComponent implements OnInit {
  displayedColumns: string[] = [
    'productId',
    'productName',
    'productOwnerName',
    'developers',
    'scrumMasterName',
    'startDate',
    'methodology',
    'actions',
  ];
  frontendData: ProductModel[] = [];
  tableData: any;
  scrumMasterList: string[] = [];
  developerList: string[] = [];
  filteredListForScrumMaster!: Observable<any[]>;
  filteredListForDevelopers!: Observable<any[]>;
  filterOptionsForm: FormGroup = new FormGroup({});
  productLength = 0;
  expandedElement: any | null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dataTableService: DataTableService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filterOptionsForm = this.fb.group({
      scrumMasterFilter: [''],
      developerFilter: [''],
    });
    this.initialDataLoad();
  }

  initialDataLoad() {
    this.dataTableService.getProductList().subscribe((backendData) => {
      this.frontendData = backendData.productList;
      this.tableData = new MatTableDataSource(this.frontendData);
      this.productLength = this.tableData.filteredData.length;
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
      this.sortFilterLists(this.tableData.filteredData);
      this.loadAutoComplete();
    });
  }

  loadAutoComplete() {
    this.filteredListForScrumMaster = this.scrumFieldControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value;
        return name
          ? this._filterScrumMaster(name as string)
          : this.scrumMasterList.slice();
      })
    );
    this.filteredListForDevelopers =
      this.developerFieldControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value;
          return name
            ? this._filterDevelopers(name as string)
            : this.developerList.slice();
        })
      );
  }
  get scrumFieldControl() {
    return this.filterOptionsForm.get('scrumMasterFilter') as FormControl;
  }
  get developerFieldControl() {
    return this.filterOptionsForm.get('developerFilter') as FormControl;
  }
  private _filterScrumMaster(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.scrumMasterList.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }
  private _filterDevelopers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.developerList.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }

  sortFilterLists(tableData: any) {
    this.scrumMasterListFilter(tableData);
    this.developerListFilter(tableData);
  }
  scrumMasterListFilter(tableData: any) {
    for (let i = 0; i < tableData.length; i++) {
      this.scrumMasterList.push(tableData[i].scrumMasterName);
    }
  }
  developerListFilter(tableData: any) {
    for (let i = 0; i < tableData.length; i++) {
      for (let x = 0; x < tableData[i].developers.length; x++) {
        this.developerList.push(tableData[i].developers[x]);
      }
    }
  }

  filterTable(filterText: any) {
    console.log(filterText);
    if (filterText.target) {
      this.tableData.filter = filterText.target.value.trim().toLowerCase();
    }
    if (filterText.option) {
      this.tableData.filter = filterText.option.value.trim().toLowerCase();
    }
    this.productLength = this.tableData.filteredData.length;
  }

  resetFilters() {
    this.filterOptionsForm.get('scrumMasterFilter')?.setValue('');
    this.filterOptionsForm.get('developerFilter')?.setValue('');
    this.tableData.filter = '';
    this.productLength = this.tableData.filteredData.length;
  }

  addProduct() {
    const addProductPopup = this.dialog.open(AddProductPopupComponent, {
      disableClose: true,
    });
    addProductPopup.afterClosed().subscribe((newProductData) => {
      if (!newProductData) {
        return;
      }
      newProductData.productId = this.checkHighestIdValue() + 1;
      this.dataTableService.addProduct(newProductData);
      this.frontendData.unshift(newProductData);
      console.log(this.frontendData);
      this.tableData.data = this.frontendData;

    });
  }

  checkHighestIdValue() {
    let sortingData = [...this.frontendData].sort((a, b) => b.productId - a.productId);
    return sortingData[0].productId;
  }

  editProduct(i: number) {
    console.log('blah');
  }

  deleteProduct(i: number) {}
}
