import { Component, OnInit } from '@angular/core';
import { Academicyeardocum } from '../../../models/class/class.documentacademicyear';
import swal from 'sweetalert2';
import { DataTable } from 'app/models/interfaces/datatable';
import { AcademicYearService } from '../../../services/academic_year/academic-year.service';
import { FormsModule } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-listacademicyear',
  templateUrl: './listacademicyear.component.html',
  styleUrls: ['./listacademicyear.component.css']
})

export class ListacademicyearComponent implements OnInit {
  public data_academicyear : Array<Academicyeardocum>;
  public AcadyearD: Academicyeardocum;
  public isEdit = false;
  public dataTable: DataTable;
  public tablaAcadyear;
  public isActive = false; // Cambio de 'public' a 'isActive'
  public months: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  public days: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  public years: number[] = Array.from({length: 51}, (_, i) => 2000 + i);

  constructor(private AcademicyearService : AcademicYearService) { 

  }

  ngOnInit(): void {
    $('.datepicker').datetimepicker({
      format: 'YYYY-MM-DD',    
      icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-chevron-up",
          down: "fa fa-chevron-down",
          previous: 'fa fa-chevron-left',
          next: 'fa fa-chevron-right',
          today: 'fa fa-screenshot',
          clear: 'fa fa-trash',
          close: 'fa fa-remove'
      }
   });
    this.dataTable = $('#datatables').DataTable({});
   
    this.AcadyearD = {
      academic_year_id: '',
      month_start: '',
      day_start: '',
      year_start: '',
      month_end: '',
      day_end: '',
      year_end: '',
      year_status: false,
    }
    this.dataTable = {
      headerRow: ['ID', 'Mes Inicia', 'Dia Inicia', 'Año Inicia', 'Mes Finaliza', 'Dia Finaliza', 'Año Finaliza', 'Estado'],
      footerRow: ['ID', 'Mes Inicia', 'Dia Inicia', 'Año Inicia', 'Mes Finaliza', 'Dia Finaliza', 'Año Finaliza', 'Estado'],
      dataRows: []
    };
    
    this.data_academicyear = [];
    this.getAcademicyear()

  }
  async getAcademicyear() {
    const response = await this.AcademicyearService.allAcademicyear();
    response.subscribe(AcadyearD  => {
      this.data_academicyear = AcadyearD;
      this.initDataTable();
    });
  }
  public addAcademicyear(AcadyearD : Academicyeardocum): void {
  
    this.isEdit = false;
    AcadyearD= this.AcadyearD = {
      academic_year_id: new Date().getTime().toString(),
      month_start: '',
      day_start: '',
      year_start: '',
      month_end: '',
      day_end: '',
      year_end: '',
      academic_year_status: false,
    }
  }
  async saveAcademicyear(AcadyearD : Academicyeardocum, isValid: boolean) {
    if (isValid) {
      this.AcademicyearService.saveAcademicyear(AcadyearD);
      $('#exampleModalCenter').modal('hide');
      swal({
        title: 'Ok',
        text: 'Datos procesados correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success',

      }).catch(swal.noop)
    } else {
      console.log('*** ERROR INVALIDO ***');
    }
  }

  public editAcademicyear(AcadyearD : Academicyeardocum): void {
    if (AcadyearD) {
      this.AcadyearD = AcadyearD;
      this.isEdit = true;
    } else {
    }

  }

  // Elimina un registro de "academic_year"
  async deleteAcademicyear(AcadyearD : Academicyeardocum) {
    swal({
      title: 'Desea eliminar este Registro?',
      text: AcadyearD.academic_year_id,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.AcademicyearService.deleteAcademicyear(AcadyearD);

        swal({
          title: 'Ok',
          text: 'Se eliminó el Representante! ' + AcadyearD.academic_year_id,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }

  initDataTable() {
    let gridgeneral = this.tablaAcadyear;
    $('#datatables').DataTable().destroy();
    setTimeout(function () {

      gridgeneral = $('#datatables').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ registros",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible",
          "sInfo":           "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty":      "Registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(Total de _MAX_ registros)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
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

}
