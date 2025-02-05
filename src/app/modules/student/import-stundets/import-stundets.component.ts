import { Component, OnInit } from "@angular/core";
import { Student } from "../../../models/student/student.model";
import { StudentService } from "../../../services/student/student.service";
import { Studentdocum } from "../../../models/class/class.documentstudent";
import swal from "sweetalert2";
import { UnitEducational } from "../../../models/class/class.documentUnitEducational";
import { take } from "rxjs/operators";
import { Teacher } from "../../../models/teacher/teacher.model";
import { SendEmailService } from "../../../services/sendEmail/send-email.service";
import { RepresentativeService } from "../../../services/representative/representative.service";
declare var $: any;

@Component({
  selector: "app-import-stundets",
  templateUrl: "./import-stundets.component.html",
  styleUrls: ["./import-stundets.component.css"],
})
export class ImportStundetsComponent implements OnInit {
  public contEstudentImport = 0;
  public infoUser: UnitEducational;
  public fileContent: any;
  public arrayDataFile: Array<Student>;
  public teacher: Student;
  dataTable: { headerRow: string[]; footerRow: string[]; dataRows: any[] };

  constructor(
    private studentService: StudentService,
    public sendEmailService: SendEmailService,
    private representativeService: RepresentativeService
  ) {}

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.dataTable = {
      headerRow: [
        "IDENTIFICACIÓN",
        "NOMBRE",
        "APELLIDO",
        "EMAIL",
        "TELEFONO",
        "IDGRADO",
        "IDPARALELO",
        "ESTADO",
      ],
      footerRow: [
        "IDENTIFICACIÓN",
        "NOMBRE",
        "APELLIDO",
        "EMAIL",
        "TELEFONO",
        "IDGRADO",
        "IDPARALELO",
        "ESTADO",
      ],
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
    var cont = 0;
    // console.log(this.fileContent)
    const lines = this.fileContent.split("\n");
    lines.forEach((element) => {
      const cols: string[] = element.split(csvSeparator);
      this.teacher = {
        student_id: cont + "" + new Date().getTime().toString(),
        student_identification: cols[0],
        student_name: cols[1],
        student_lastname: cols[2],
        student_email: cols[3].trim(),
        student_phone: cols[4].trim(),
        student_grade_id: cols[5].trim(),
        student_parallel_id: cols[6].trim(),
        student_status: true,
      };
      csv.push(this.teacher);
      // console.log(csv)
      cont++;
    });
    this.arrayDataFile = csv;
    this.arrayDataFile.splice(0, 1);
  }

  public async sendFileData() {
    swal({
      title: "Espera",
      text: "Importando información",
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });
    for (const x of this.arrayDataFile) {
      const student: Student = x as Student;
      if (student.student_identification !== undefined) {
        await this.validateStudent(student);
      }
      console.log(this.contEstudentImport + "==" + this.arrayDataFile.length);

      if (this.contEstudentImport == this.arrayDataFile.length) {
        $("#exampleModalCenterImport").modal("hide");
        swal({
          title: "Ok",
          text: "Datos procesados correctamente!",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
          onBeforeOpen: () => {
            swal.hideLoading();
          },
        }).catch(swal.noop);
      }
    }
  }

  private async validateStudent(teacherCSV: Student) {
    this.contEstudentImport++;
    const responseEmail = await this.studentService
      .finStudentByEmail(teacherCSV.student_email)
      .pipe(take(1))
      .toPromise();
    const responseIdentification = await this.studentService
      .finStudentByIdentification(teacherCSV.student_identification)
      .pipe(take(1))
      .toPromise();
    if (responseEmail.length === 0 && responseIdentification.length === 0) {
      console.log("Entro a if");
      await this.saveStudent(teacherCSV);
    } else {
      console.log("Entro else");
      console.log(teacherCSV);
      await this.studentService
        .finStudentByEmail(teacherCSV.student_email)
        .subscribe((respuesta) => {
          if (respuesta.length !== 0) {
            this.sendEmailService.sendEmailConfirmImportStudent(
              respuesta[0],
              teacherCSV.student_email
            );
          } else {
            this.studentService
              .finStudentByIdentification(teacherCSV.student_identification)
              .subscribe((res) => {
                if (res.length !== 0) {
                  this.sendEmailService.sendEmailConfirmImportStudent(
                    res[0],
                    teacherCSV.student_email
                  );
                }
              });
          }
        });
    }
  }

  async saveStudent(StudentD: Student) {
    console.log("*** Guardando... ***");
    this.studentService
      // .saveStudents(StudentD, this.infoUser.unit_educational_id)
      .saveStudents(StudentD)
      .then(() => {});

    // (r => '');
    // $('#exampleModalCenterImport').modal('hide');
    // swal({
    //   title: 'Ok',
    //   text: 'Datos procesados correctamente!',
    //   buttonsStyling: false,
    //   confirmButtonClass: 'btn btn-fill btn-success',
    //   type: 'success',
    // }).catch(swal.noop)
  }
}
