import { Component, OnInit } from '@angular/core';
import { TextBook } from 'app/models/external_resources/textbook.model';
import { UploadResourcesService } from 'app/services/external_resources/upload-resources.service';


@Component({
  selector: 'app-import-files',
  templateUrl: './import-files.component.html',
  styleUrls: ['./import-files.component.css']
})
export class ImportFilesComponent implements OnInit {
  fileContent: any;
  arrayDataFile: Array<TextBook>;
  dataTable: { headerRow: string[]; footerRow: string[]; dataRows: any[]; };
  textbook: TextBook;
  downloadURL: any;
  constructor(private uploadResourcesService: UploadResourcesService) { }

  ngOnInit(): void {
    this.dataTable = {
      headerRow: ['COMPETENCIAS', 'GRADO', 'ID GRADO', 'ID MATERIA', 'MATERIA', 'TITULO', 'TIPO', 'URL'],
      footerRow: ['COMPETENCIAS', 'GRADO', 'ID GRADO', 'ID MATERIA', 'MATERIA', 'TITULO', 'TIPO', 'URL'],
      dataRows: []
    };
  }


  onSelectFile(files) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        this.fileContent = csv;
        this.listDataFile();
      }
    }
  }

  async listDataFile() {
    const csvSeparator = ';';
    const csv = [];
    const lines = this.fileContent.split('\n');
    lines.forEach(element => {
      const cols: string[] = element.split(csvSeparator);
      this.textbook = {
        competencies: cols[0],
        grade_name: cols[1],
        id_grade: cols[2],
        id_subject: cols[3],
        subject_name: cols[4],
        textbook_title: cols[5],
        type: cols[6],
        url: cols[7],
      }
      csv.push(this.textbook);
    });
    this.arrayDataFile = csv;
    this.arrayDataFile.splice(0, 1)
  }

  sendFileData(arrayDataFile) {
    const arraySec = arrayDataFile.filter(element => element.type === 'pdf');
    arraySec.forEach(element => {
      // console.log(element);
      this.uploadResourcesService.saveTextBooks(element);
    });

    const array = arrayDataFile.filter(element => element.type === 'mp4');
    array.forEach(element => {
     // console.log(element);
     this.uploadResourcesService.saveVideos(element);
    });


  }
}
