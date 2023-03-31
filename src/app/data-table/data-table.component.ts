import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
import { ConfirmStopEditPopup } from './confirm-stop-edit-popup/confirm-stop-edit-popup.component';
import { DeleteProductDialog } from './delete-product-dialog/delete-product-dialog.component';
import { ConfirmCloseDialogComponent } from './confirm-close-dialog/confirm-close-dialog.component';

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
  editProductForm: FormGroup = new FormGroup({});
  productLength = 0;
  expandedElement: any | null;
  currentlyEditing: boolean = false;
  formDirty: boolean = false;
  textOnlyError: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductModel>;

  constructor(
    private dataTableService: DataTableService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.filterOptionsForm = this.fb.group({
      scrumMasterFilter: [''],
      developerFilter: [''],
    });
    this.initialDataLoad();
  }

  //Get data from backend
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

  //load Auto-complete data once from end data is received
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

  //Filtering setup for Auto-complete
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


  //filter table for either Scrum Master or Developers
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

  //clear filters button
  resetFilters() {
    this.filterOptionsForm.get('scrumMasterFilter')?.setValue('');
    this.filterOptionsForm.get('developerFilter')?.setValue('');
    this.tableData.filter = '';
    this.productLength = this.tableData.filteredData.length;
  }

  //From child component, passes data from the Add product form down, processed then saved as well as updating front end view
  addProduct() {
    const addProductPopup = this.dialog.open(AddProductPopupComponent, {
      disableClose: true,
    });

    addProductPopup.afterClosed().subscribe((newProductData) => {
      if (!newProductData) {
        return;
      }
      newProductData.productId = this.checkHighestIdValue();
      newProductData.productId++;
      this.dataTableService.addProduct(newProductData);
      this.frontendData.unshift(newProductData);
      this.tableData.data = this.frontendData;
      this.productLength = this.tableData.filteredData.length;
    });
  }

  //sort product ID by highest and add a value to give the next product ID
  checkHighestIdValue(): number {
    let sortingData = [...this.frontendData].sort(
      (a, b) => b.productId - a.productId
    );
    return sortingData[0].productId;
  }

  //Initiate Editing function and Expansion panel
  editProduct(product: ProductModel, index: number) {
    if (this.currentlyEditing) {
      if (this.editProductForm.dirty) {
        const confirmStopEdit = this.dialog.open(ConfirmStopEditPopup);
        confirmStopEdit.afterClosed().subscribe((result) => {
          if (result) {
            this.currentlyEditing = false;
            this.expandedElement =
              this.expandedElement == product ? null : product;
            return;
          } else {
            return;
          }
        });
      }
      else {
        this.currentlyEditing = false;
        this.expandedElement = this.expandedElement == product ? null : product;
      }
    } else {
      const actualIndex = index + this.paginator.pageIndex * this.paginator.pageSize;
      this.initializeEditingForm(actualIndex);
      this.currentlyEditing = true;
      this.expandedElement = this.expandedElement == product ? null : product;
    }
  }

  initializeEditingForm(index: number) {
    this.editProductForm = this.fb.group({
      productName: [
        this.tableData.data[index].productName,
        [Validators.required],
      ],
      productOwner: [
        this.tableData.data[index].productOwnerName,
        [Validators.required],
      ],
      scrumMaster: [
        this.tableData.data[index].scrumMasterName,
        [Validators.required],
      ],
      methodology: [
        this.tableData.data[index].methodology,
        [Validators.required],
      ],
      developers: this.fb.array([]),
    });
    this.loadDevelopersArray(this.tableData.data[index].developers);
  }

  get developers() {
    return this.editProductForm.controls['developers'] as FormArray;
  }

  loadDevelopersArray(developerArray: string[]) {
    for (let i = 0; i < developerArray.length; i++) {
      let developerControl = this.fb.group({
        developers: [developerArray[i], [Validators.required]],
      });
      this.developers.push(developerControl);
    }
  }

  //Add additional developer up to 5
  editAddDeveloper() {
    if (this.developers.length > 4) {
      return;
    }
    const newDeveloper = this.fb.group({
      developers: ['', [Validators.required]],
    });
    this.developers.push(newDeveloper);
  }

  //Remove developers minimum 1
  removeDeveloper(index: number) {
    if (this.developers.length < 2) {
      return;
    }
    this.developers.removeAt(index);
  }


  //Save the Edited product, parse/process info and send to backend, also update front end.
  saveEditProduct(product: ProductModel) {
    if (this.editProductForm.invalid || this.textOnlyError) {
      this.editProductForm.markAllAsTouched();
      return;
    }
    this.currentlyEditing = false;
    let parseDevelopers: string[] = [];
    for (let i = 0; i < this.editProductForm.value.developers.length; i++) {
      parseDevelopers.push(
        this.editProductForm.value.developers[i].developers
      );
    }
    product.productName = this.editProductForm.value.productName;
    product.productOwnerName = this.editProductForm.value.productOwner;
    product.scrumMasterName = this.editProductForm.value.scrumMaster;
    product.methodology = this.editProductForm.value.methodology;
    product.developers = parseDevelopers
    this.dataTableService.editProduct(product);
    this.expandedElement = this.expandedElement == product ? null : product;
  }

  //Bonus feature to complete CRUD, delete any product
  deleteProduct(product: ProductModel, index: number) {
    const actualIndex = index + this.paginator.pageIndex * this.paginator.pageSize;
    let deletePopup = this.dialog.open(DeleteProductDialog);
    deletePopup.afterClosed().subscribe(result => {
      if (result) {
        this.dataTableService.deleteProduct(product);
        this.frontendData.splice(actualIndex, 1);
        this.tableData.data = this.frontendData;
        this.productLength = this.tableData.filteredData.length;
        this.table.renderRows();
      }
      else {
        return;
      }
    })
  }

  //Sanitary check to ensure only text is used for fields
  checkValidText(x: any) {
    if (!/^[a-zA-Z ]*$/.test(x.target.value)) {
      this.textOnlyError = true;
    }
    else {
      this.textOnlyError = false;
    }
  }
}


