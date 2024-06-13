import { Component, OnInit } from '@angular/core';
import { Representativedocum } from '../../../models/class/class.documentRepresentative';
import swal from 'sweetalert2';
import { DataTable } from 'app/models/interfaces/datatable';
import { RepresentativeService } from '../../../services/representative/representative.service';
declare var $: any;
@Component({
  selector: 'app-listrepresentative',
  templateUrl: './listrepresentative.component.html',
  styleUrls: ['./listrepresentative.component.css']
})
export class ListrepresentativeComponent implements OnInit {
  public data_representative : Array<Representativedocum>;
  public RepresD: Representativedocum;
  public isEdit = false;
  public dataTable: DataTable;
  public tablaRepresent;
  public = false;

  constructor(private RepresentativeService : RepresentativeService) { 
    
  }

  ngOnInit(): void {
    this.dataTable = $('#datatables1').DataTable({});

    this.RepresD = {
      representative_id: new Date().getTime().toString(),
      representative_identification : '',
      representative_name : '',
      representative_lastname : '',
      representative_email : '',
      representative_phone : '',
      representative_movil : '',
      representative_address : '',
      representative_password : '',
      representative_status : false,
      representative_student : '',
    }

    this.dataTable = {
      headerRow: ['CEDULA', 'NOMBRE',  'APELLIDO','EMAIL','TELEFONO', 'ESTADO'],
      footerRow: ['CEDULA', 'NOMBRE',  'APELLIDO','EMAIL','TELEFONO', 'ESTADO'],
      dataRows: []
    };
    this.data_representative = [];
    this.getRepresentativedata()
  }
  async getRepresentativedata() {
    const response = await this.RepresentativeService.allrepresentative();
    response.subscribe(RepresD  => {
      this.data_representative = RepresD;
      this.initDataTable();
    });
  }
  public addRepresentative(RepresD: Representativedocum): void {
    this.isEdit = false;
    RepresD= this.RepresD = {
      representative_id: new Date().getTime().toString(),
      representative_identification : '',
      representative_name : '',
      representative_lastname : '',
      representative_email : '',
      representative_phone : '',
      representative_movil : '',
      representative_address : '',
      representative_password : '',
      representative_status : false,
      representative_student : '',
    }
  }
  async saveRepresentative(RepresD: Representativedocum, isValid: boolean) {
    if (isValid) {
      this.RepresentativeService.saveRepresentative(RepresD);
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
  public editRepres(RepresD: Representativedocum): void {
    if (RepresD) {
      this.RepresD = RepresD;
      this.isEdit = true;
      console.log(RepresD)
    } else {
    }

  }

  async deleteRepres(RepresD: Representativedocum) {
    swal({
      title: 'Desea eliminar este Registro?',
      text: RepresD.representative_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.RepresentativeService.deletearea(RepresD);

        swal({
          title: 'Ok',
          text: 'Se inactivó el Representante! ' + RepresD.representative_name,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }
  initDataTable() {
    let gridgeneral = this.tablaRepresent;
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
