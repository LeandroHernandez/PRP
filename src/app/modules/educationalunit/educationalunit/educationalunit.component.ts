import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Librariesdate } from "app/libraries/class/class.librariesdate";
import { ModalAddOrEditNewEuComponent } from "app/modals/modal-add-or-edit-new-eu/modal-add-or-edit-new-eu.component";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";
import swal from "sweetalert2";

@Component({
  selector: "app-educationalunit",
  templateUrl: "./educationalunit.component.html",
  styleUrls: ["./educationalunit.component.css"],
})
export class EducationalunitComponent implements OnInit {
  public libraries_date = new Librariesdate();
  // public educationalUnities: IEducationalUnit[] = [];
  public educationalUnities: IEducationalUnit[] | null = null;

  public educationalUnit: IEducationalUnit | null;

  constructor(
    private _educationalUnitSvc: EducationalUnitService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // const uid: string = this.parameterToEdit
    //   ? this.parameterToEdit.uid
    //   : this.libraries_date.get_timestamp_current().toString();
    // const uid: string = this.libraries_date.get_timestamp_current().toString();
    // this._educationalUnitSvc.save_and_update_club(uid, {
    //   uid,
    //   name: "Club Principal",
    //   logo: "https://firebasestorage.googleapis.com/v0/b/futbol-premium-player.appspot.com/o/UnitEducational%2Flogo_1720468049864.png?alt=media&token=3ebf4611-385a-4690-9c2f-5c2f51345501",
    //   state: true,
    // });
    this.getAll();
  }

  getAll(): void {
    this._educationalUnitSvc.get_all_educational_unit().subscribe(
      (educationalUnities) => {
        console.log({ educationalUnities });
        this.educationalUnities = educationalUnities;
      },
      (error) => {
        console.log({ error });
        this.educationalUnities = [];

        swal({
          title: "Error",
          text: "Ocurrio un error por lo que no fue posible cargar las Unidades Educativas, por favor vuelva a intentarlo",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-error",
          type: "error",
        });
      },
      () => {
        this.educationalUnities = [];
      }
    );
  }

  openModalAddNewUE(): void {
    // const dialogRef = this.dialog.open(ModalAddNewUEComponent, {
    const dialogRef = this.dialog.open(ModalAddOrEditNewEuComponent, {
      width: "950px",
      maxWidth: "90%",
      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.shareDataService.setFile(null);
    });
  }

  async deleteEducationalUnit(
    educationalUnit: IEducationalUnit
  ): Promise<void> {
    return await this._educationalUnitSvc
      .delete_logic_educational_unit(educationalUnit.uid, educationalUnit)
      .then(() => {
        swal({
          title: "Eliminada",
          text: "Unidad Educativa eliminada exitosamente",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-error",
          type: "success",
        });
      })
      .catch((error) => {
        console.log({ error });
        swal({
          title: "Error",
          text: "No fue posible eliminar la Unidad Educativa",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-error",
          type: "error",
        });
      });
  }
}
