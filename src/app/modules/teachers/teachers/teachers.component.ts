import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

/**Models */
import { Teacher } from 'app/models/teacher/teacher.model';
import { DataTable } from 'app/models/interfaces/data-table';

/**Service */
import { TeachersService } from 'app/services/teachers/teachers.service'
import { map } from 'rxjs/operators';
import { UnitEducational } from '../../../models/class/class.documentUnitEducational';
declare var $: any;

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  public infoUser: UnitEducational;
  public teacher: Teacher;
  public arrayTeachers: Array<Teacher>;
  public isEdit = false;
  public dataTable: DataTable;
  public teacher_unit_educational: string;
  public tableTeacher : any;
  constructor(private teacherService: TeachersService) { }

  ngOnInit(): void {
    this.tableTeacher = $('#datatablesTeacher').DataTable({});
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.teacher_unit_educational = '1595284236691'
    this.teacher = {
      teacher_name: 'aaa',
      teacher_identification: '00987654321',
      teacher_email: 'aaa@gmail.com',
      teacher_pass: 'aaa',
      teacher_phone: 'aaa',
      teacher_surname: 'aaa',
      teacher_id: new Date().getTime().toString(),
      teacher_status: false,
    }

    this.dataTable = {
      headerRow: ['ID', 'IDENTIFICACIÓN', 'NOMBRE', 'APELLIDO', 'EMAIL', 'ESTADO'],
      footerRow: ['ID', 'IDENTIFICACIÓN', 'NOMBRE', 'APELLIDO', 'EMAIL', 'ESTADO'],
      dataRows: []
    };
    this.arrayTeachers = [];
    this.getTeachers()
  }

  /**
 * OBTENER DATOS DE PROFESOR
 */
  async getTeachers() {
    var aux = [];
    this.teacherService.getAllTeachers(this.infoUser.unit_educational_id).subscribe(teacher => {
      this.arrayTeachers = teacher;


      aux = [];
      teacher.forEach(element => {
        if (element.teacher_status) {
          aux.push(element);
        }
      });
      this.arrayTeachers = aux;

        this.initDataTable()
      
    });
    
  }
  /**
 * AGREGAR REGISTRO DE DOCENTE
 * @param level
 */
  public addTeacher(teacher: Teacher): void {
    console.log('agregar')
    this.isEdit = false;
    teacher = this.teacher = {
        teacher_name: '',
        teacher_identification: '',
        teacher_email: '',
        teacher_pass: '',
        teacher_phone: '',
        teacher_surname: '',
        teacher_id: new Date().getTime().toString(),
        teacher_status: false,
    }
  }

  initDataTable() {
    let aaa = this.tableTeacher;
    $('#datatablesTeacher').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesTeacher').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          "sProcessing": "Procesando...",
          "sLengthMenu": "Mostrar _MENU_ registros",
          "sZeroRecords": "No se encontraron resultados",
          "sEmptyTable": "Ningún dato disponible",
          "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty": "Registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered": "(Total de _MAX_ registros)",
          "sInfoPostFix": "",
          "sSearch": "Buscar:",
          "sUrl": "",
          "sInfoThousands": ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          },
          "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad"
          }
        },
      });
    }, 10)
  }
  /**
 *  GUARDAR DOCENTE
 * @param teacher
 * @param isValid
 */
  async saveTeacher(teacher: Teacher, isValid: boolean): Promise<void> {
    if (isValid) {
      this.teacherService.saveTeacher(teacher, true, this.infoUser.unit_educational_id);
      $('#exampleModalCenter').modal('hide');
      swal({
        title: 'Ok',
        text: 'Datos procesados correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success',

      }).catch(swal.noop)
    } else {
      console.log('*** INVALIDO ***');
    }
    this.teacher = {
      teacher_id: new Date().getTime().toString(),
      teacher_status: false,
  }
  }

  /**
 *  EDITAR DOCENTE
 * @param teacher
 */
  public editTeacher(teacher: Teacher): void {
    if (teacher) {
      this.teacher = teacher;
      this.isEdit = true;
    } else {
      return null;
    }

  }

  /** Elimina de manera logica el docente
 * @param teacher
*/
  async deleteTeacher(teacher: Teacher) {
    this.isEdit = true;
    swal({
      title: 'Desea eliminar el docente?',
      text: teacher.teacher_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.teacherService.deleteTeacher(teacher);

        swal({
          title: 'Ok',
          text: 'Se inactivó el docente! ' + teacher.teacher_name,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }
}
