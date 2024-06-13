import { Component, OnInit, ViewChild } from '@angular/core';
import { Documenteducationalunit } from '../../../models/class/class.documenteducationalunit';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EducationalunitService } from '../../../services/educational-unit/educationalunit.service';

@Component({
  selector: 'app-listeducationalunit',
  templateUrl: './listeducationalunit.component.html',
  styleUrls: ['./listeducationalunit.component.css']
})
export class ListeducationalunitComponent implements OnInit {

  public displayedColumns;
  public dataSource;

  public data_educational_unit = new Array<Documenteducationalunit>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private educationalunitService : EducationalunitService
  ) { }

  ngOnInit(){
    this.get_data_educational_unit();
  }

  load_data_table_pagination(data){
    this.displayedColumns  = ['educational_unit_id', 'educational_unit_logo', 'educational_unit_name', 'educational_unit_email', 'educational_unit_number_of_students', 'educational_unit_telephone', 'option'];
    this.dataSource = new MatTableDataSource<Documenteducationalunit>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get_data_educational_unit(){

    this.educationalunitService.get_all_educational_unit().subscribe(
      dataeducationalunit => {
        console.log(dataeducationalunit);
        this.load_data_table_pagination(dataeducationalunit);
      },
      erroreducationalunit => {
        console.log(erroreducationalunit);
        this.load_data_table_pagination([]);
      }
    )
  }

}
