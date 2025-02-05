// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ImportTeachersComponent } from './import-teachers.component';

// describe('ImportTeachersComponent', () => {
//   let component: ImportTeachersComponent;
//   let fixture: ComponentFixture<ImportTeachersComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ImportTeachersComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ImportTeachersComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { Component, OnInit } from "@angular/core";

/** MODELS */
import { Teacher } from "app/models/teacher/teacher.model";
import { UnitEducational } from "../../../models/class/class.documentUnitEducational";
import { TeachersService } from "../../../services/teachers/teachers.service";
import swal from "sweetalert2";

declare var $: any;

@Component({
  selector: "app-import-teachers",
  templateUrl: "./import-teachers.component.html",
  styleUrls: ["./import-teachers.component.css"],
})
export class ImportTeachersComponent implements OnInit {
  public infoUser: UnitEducational;
  public fileContent: any;
  public arrayDataFile: Array<Teacher>;
  dataTable: { headerRow: string[]; footerRow: string[]; dataRows: any[] };
  public teacher: Teacher;
  downloadURL: any;

  constructor(private teacherService: TeachersService) {}

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.dataTable = {
      headerRow: ["IDENTIFICACIÓN", "NOMBRE", "APELLIDO", "EMAIL", "ESTADO"],
      footerRow: ["IDENTIFICACIÓN", "NOMBRE", "APELLIDO", "EMAIL", "ESTADO"],
      dataRows: [],
    };
  }

  public onSelectFile(files) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.fileContent = reader.result as string;
        this.listDataFile();
      };
    }
  }

  private async listDataFile() {
    const csvSeparator = ",";
    const csv = [];
    const lines = this.fileContent.split("\n");
    lines.forEach((element) => {
      const cols: string[] = element.split(csvSeparator);
      this.teacher = {
        teacher_id: new Date().getTime().toString(),
        teacher_identification: cols[0],
        teacher_name: cols[1],
        teacher_surname: cols[2],
        teacher_email: cols[3],
        teacher_status: true,
      };
      csv.push(this.teacher);
    });
    this.arrayDataFile = csv;
    this.arrayDataFile.splice(0, 1);
  }

  public sendFileData() {
    for (const x of this.arrayDataFile) {
      if (x.teacher_email !== undefined) {
        this.getTeacherByEmail(x);
      }
    }
  }

  private async getTeacherByEmail(teacherCSV: Teacher) {
    let teacherSave: Teacher;
    const response = await this.teacherService.findTeacherEmail(
      teacherCSV.teacher_email
    );
    response.subscribe((teacherResponse) => {
      const teacher = teacherResponse as Array<Teacher>;
      if (teacher.length > 0) {
        teacherSave = teacher[0];
        if (
          teacherSave.teacher_unit_educational.includes(
            this.infoUser.unit_educational_id
          )
        ) {
          console.log("NO INGRESAR");
        } else {
          teacherSave.teacher_unit_educational.push(
            this.infoUser.unit_educational_id
          );
          this.saveTeacher(teacherSave, false);
        }
      } else {
        teacherSave = teacherCSV;
        teacherSave.teacher_id = new Date().getTime().toString();
        teacherSave.teacher_unit_educational = [
          this.infoUser.unit_educational_id,
        ];
        this.saveTeacher(teacherSave, true);
      }
    });
  }

  private async saveTeacher(teacher: Teacher, isNew: boolean) {
    console.log(teacher);
    this.teacherService.addUnitEducational(teacher, isNew).then((r) => "");
    $("#exampleModalCenter").modal("hide");
    swal({
      title: "Ok",
      text: "Datos procesados correctamente!",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-fill btn-success",
      type: "success",
    }).catch(swal.noop);
  }
}
