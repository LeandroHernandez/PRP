import { Component, Input, OnInit } from "@angular/core";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";
import { Subscription } from "rxjs";
import swal from "sweetalert2";

@Component({
  selector: "app-educational-unit-edit",
  templateUrl: "./educational-unit-edit.component.html",
  styleUrls: ["./educational-unit-edit.component.css"],
})
export class EducationalUnitEditComponent implements OnInit {
  @Input() educationalUnit: IEducationalUnit | null = null;

  constructor(private _educationalUnitSvc: EducationalUnitService) {}

  ngOnInit(): void {}

  public async changeState(educationalUnit: IEducationalUnit, state: boolean): Promise<void> {
    try {
      await this._educationalUnitSvc.save_and_update_educational_unit(educationalUnit.uid, {
        ...educationalUnit,
        state,
      });
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
