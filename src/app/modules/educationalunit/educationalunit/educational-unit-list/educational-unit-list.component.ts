import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataTable } from "app/models/interfaces/data-table";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";
import swal from "sweetalert2";

@Component({
  selector: "app-educational-unit-list",
  templateUrl: "./educational-unit-list.component.html",
  styleUrls: ["./educational-unit-list.component.css"],
})
export class EducationalUnitListComponent implements OnInit {
  @Input() educationalUnities: IEducationalUnit[] | null = null;
  @Output() educationalUnitEmitter: EventEmitter<IEducationalUnit> =
    new EventEmitter();
  @Output() deleteEducationalUnitEmitter: EventEmitter<IEducationalUnit> =
    new EventEmitter();

  public dataTable: DataTable = {
    headerRow: [
      "#",
      "LOGO",
      "NOMBRE",
      "CÓDIGO",
      "CONTRASEÑA",
      "ESTADO",
      "ACCIONES",
    ],
    footerRow: [
      "#",
      "LOGO",
      "NOMBRE",
      "CÓDIGO",
      "CONTRASEÑA",
      "ESTADO",
      "ACCIONES",
    ],
    dataRows: [[]],
  };

  constructor(private _educationalUnitSvc: EducationalUnitService) {}

  ngOnInit(): void {}

  editAction(educationalUnit: IEducationalUnit) {
    return this.educationalUnitEmitter.emit(educationalUnit);
  }

  deleteAction(educationalUnit: IEducationalUnit) {
    return this.deleteEducationalUnitEmitter.emit(educationalUnit);
  }

  public async changeState(
    educationalUnit: IEducationalUnit,
    state: boolean
  ): Promise<void> {
    try {
      await this._educationalUnitSvc.save_and_update_educational_unit(
        educationalUnit.uid,
        {
          ...educationalUnit,
          state,
        }
      );
      swal({
        title: "Ok",
        text: "Datos procesados correctamente!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      }).catch(swal.noop);
    } catch (error) {
      console.log({ error });
      swal({
        title: "Error",
        text: "Ocurrio un error por lo cual no fue posible cambiar el estado del nivel, por favor vuelva a intentarlo",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "error",
      }).catch(swal.noop);
    }
  }
}
