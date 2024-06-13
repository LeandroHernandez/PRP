import {Component, OnInit} from '@angular/core';
import {Studentdocum} from '../../../models/class/class.documentstudent';
import swal from 'sweetalert2';
import {DataTable} from 'app/models/interfaces/datatable';
import {StudentService} from '../../../services/student/student.service';
import {UnitEducational} from 'app/models/class/class.documentUnitEducational';
import {Student} from '../../../models/student/student.model';
import {RepresentativeService} from '../../../services/representative/representative.service';
import {RepresentedStudentdocum} from '../../../models/class/class.documentrepresentedstudent';
import {Representativedocum} from '../../../models/class/class.documentRepresentative';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'app-liststudent',
  templateUrl: './liststudent.component.html',
  styleUrls: ['./liststudent.component.css']
})
export class ListstudentComponent implements OnInit {
  public infoUser: UnitEducational;
  public data_student: Array<Studentdocum>;
  public StudentD: Studentdocum;
  public representative: Representativedocum;
  public isEdit = false;
  public isEnabled = false;
  public dataTable: DataTable;
  public tablaStudent;
  public = false;
  fileName = 'ListadoEstudiantes.xlsx';

  constructor(
      private studentService: StudentService,
      private representativeService: RepresentativeService,
  ) {
  }

  ngOnInit(): void {
    this.representative = {};
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.dataTable = $('#datatables1').DataTable({});

    this.StudentD = {
      student_id: new Date().getTime().toString(),
      student_identification: '',
      student_name: '',
      student_lastname: '',
      student_email: '',
      student_phone: '',
      student_movil: '',
      student_address: '',
      student_pass: '',
      student_status: false,
      student_level_id: '',
      student_sublevel_id: '',
      student_grade_id: '',
      student_parallel_id: '',
      student_representant: '',
    }
    this.dataTable = {
      headerRow: ['CEDULA', 'NOMBRE', 'APELLIDO', 'EMAIL', 'TELEFONO', 'ESTADO', 'BLOQUEO', 'REPRESENTANTE'],
      footerRow: ['CEDULA', 'NOMBRE', 'APELLIDO', 'EMAIL', 'TELEFONO', 'ESTADO', 'BLOQUEO', 'REPRESENTANTE'],
      dataRows: []
    };
    this.data_student = [];
    this.getStudentData()
  }

  async showDataRepresentative(student: Student) {
    console.log(student);
    this.StudentD = student;
    const response = await this.representativeService.getrepresentative(student.student_representant);
    response.subscribe(representative => {
      console.log(representative);
      this.representative = representative;
    });
  }

  showDataNoRepresentative(student: Student) {
    this.StudentD = student;
    console.log(this.StudentD);
  }

  async getStudentData() {
    let cont = 0;
    let aux = [];
    const response = await this.studentService.allstudent(this.infoUser.unit_educational_id);
    response.subscribe(StudentD => {
      aux = [];
      StudentD.forEach(element => {
        if (element.student_status == null || element.student_status || element.student_enabled == null || element.student_enabled) {
          aux.push(element);
        }
      });
      this.data_student = aux;
      cont++;
      this.initDataTable();
    });
  }

  public addStudent(StudentD: Studentdocum): void {
    this.isEdit = false;
    StudentD = this.StudentD = {
      student_id: new Date().getTime().toString(),
      student_identification: '',
      student_name: '',
      student_lastname: '',
      student_email: '',
      student_phone: '',
      student_movil: '',
      student_address: '',
      student_pass: '',
      student_status: false,
      student_level_id: '',
      student_sublevel_id: '',
      student_grade_id: '',
      student_parallel_id: '',
      student_representant: '',

    }
  }

  async saveStudent(StudentD: Studentdocum, isValid: boolean, isEdit: boolean) {
    if (isValid) {
      if (isEdit) {
        await this.studentService.updateStudents(StudentD, this.infoUser.unit_educational_id);
        $('#exampleModalCenter').modal('hide');
        swal({
          title: 'Ok',
          text: 'Estudiante editado correctamente!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success',

        }).catch(swal.noop)
      } else {
        if (this.checkID(this.data_student, StudentD.student_identification)) {
          console.log('Existe');
          swal({
            title: 'Error',
            html: `<p>Ya existe un estudiante con cédula ${this.StudentD.student_identification}</p><p>Ingrese con sus credenciales ${this.StudentD.student_email}</p>`,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-fill btn-success',
            type: 'error',

          }).catch(swal.noop)
        } else {
          console.log('No existe');
          await this.studentService.saveStudents(StudentD, this.infoUser.unit_educational_id).then(() => {
            $('#exampleModalCenter').modal('hide');
            swal({
              title: 'Ok',
              text: 'Estudiante ingresado correctamente!',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-fill btn-success',
              type: 'success',

            }).catch(swal.noop)
          });
        }
      }
    } else {
      swal({
        title: 'Error',
        text: 'Revise la información del formulario!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'error',

      }).catch(swal.noop)
    }
  }

  public editStudent(StudentD: Studentdocum): void {
    if (StudentD) {
      this.StudentD = StudentD;
      this.isEdit = true;
    } else {
    }
  }

  async deleteStudent(StudentD: Studentdocum) {
    swal({
      title: 'Desea eliminar este Registro?',
      text: StudentD.student_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.studentService.deleteStudent(StudentD);

        swal({
          title: 'Ok',
          text: 'Se inactivó el Estudiante! ' + StudentD.student_name,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }

  initDataTable() {
    let gridgeneral = this.tablaStudent;
    $('#datatables').DataTable().destroy();
    setTimeout(function () {

      gridgeneral = $('#datatables').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  public blackStudent(StudentD: Studentdocum, studentEnable: boolean) {
    this.studentService.blockStudent(StudentD.student_id, studentEnable, StudentD.student_email);
  }

  checkID(array: Studentdocum[], identification: string) {
    let existe = false;
    for (let i = 0; i < array.length; i++) {
      if (array[i].student_identification.replace(' ', '') === identification.replace(' ', '')) {
        this.StudentD = array[i];
        existe = true;
        break;
      }
    }
    return existe;
  }

  exportStudentToExcel() {
    const element = document.getElementById('dataTableStudent');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado_Estudiantes');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
