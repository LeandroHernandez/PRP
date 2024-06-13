import { Component, OnInit } from '@angular/core';
import { TextBook } from 'app/models/external_resources/textbook.model';
import { DataTable } from 'app/models/interfaces/data-table';
import { UploadResourcesService } from 'app/services/external_resources/upload-resources.service';

@Component({
  selector: 'app-upload-resources',
  templateUrl: './upload-resources.component.html',
  styleUrls: ['./upload-resources.component.css']
})
export class UploadResourcesComponent implements OnInit {

  public textBook: TextBook;
  public arrayTextBook: Array<TextBook>;
  public dataTable: DataTable;

  constructor(private uploadResourcesService: UploadResourcesService) { }

  ngOnInit(): void {

    this.dataTable = {
      headerRow: ['TITULO', 'ID GRADO', 'GRADO', 'MATERIA', 'TIPO'],
      footerRow: ['TITULO', 'ID GRADO', 'GRADO', 'MATERIA', 'TIPO'],
      dataRows: []
    };
    this.getFiles()
  }

  /**
   * List textbooks
   * lista los libros de texto.
   */
  async getFiles() {
    const response = await this.uploadResourcesService.getAllTextBooks().subscribe(textBook => {
      this.arrayTextBook = textBook;
    });
  }

}
