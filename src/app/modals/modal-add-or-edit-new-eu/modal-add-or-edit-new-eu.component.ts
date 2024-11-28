import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ICity } from "app/models/interfaces/city";
import { ICountry } from "app/models/interfaces/country";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";
import swal from "sweetalert2";
import { ModalUploadLogoComponent } from "../modal-upload-logo/modal-upload-logo.component";
import { ModalAddUsersUeComponent } from "../modal-add-users-ue/modal-add-users-ue.component";
import { AcademicYearService } from "app/services/academic_year/academic-year.service";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { Librariesdate } from "app/libraries/class/class.librariesdate";

@Component({
  selector: "app-modal-add-or-edit-new-eu",
  templateUrl: "./modal-add-or-edit-new-eu.component.html",
  styleUrls: ["./modal-add-or-edit-new-eu.component.css"],
})
export class ModalAddOrEditNewEuComponent implements OnInit {
  public libraries_date = new Librariesdate();
  public form: FormGroup = this._fb.group({
    name: ["", [Validators.required]],
    country: ["", [Validators.required]],
    city: ["", [Validators.required]],
    academicDiscipline: ["", [Validators.required]],
    ruc: [
      "",
      [
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/001$/),
        Validators.required,
      ],
    ],
    product: ["", [Validators.required]],
    value: [null, [Validators.min(0), Validators.required]],
    billPhone: [
      null,
      [Validators.minLength(5), Validators.maxLength(15), Validators.required],
    ],
    phoneNumber: [
      null,
      [Validators.minLength(5), Validators.maxLength(15), Validators.required],
    ],
    address: ["", [Validators.required]],
    modules: this._fb.group({
      newsModule: [false, [Validators.required]],
      trainingModule: [false, [Validators.required]],
      copsModule: [false, [Validators.required]],
      payControlModule: [false, [Validators.required]],
    }),
    academicYearId: ["", [Validators.required]],
    state: [false, [Validators.required]],
  });

  public countryList: ICountry[] = [];
  public cityList: ICity[] = [];
  public academicYears: any[] = [];
  public products: string[] = ["Producto 1", "Producto 2", "Producto 3"];

  public file: File | null = null;
  public fileName: string = "";
  public educationalUnit: IEducationalUnit | null = null;

  constructor(
    private _fb: FormBuilder,
    private _educationalUnitSvc: EducationalUnitService,
    private academicyearService: AcademicYearService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.getCities();
    this.getAcademicYears();
  }

  getCountries(): void {
    this._educationalUnitSvc.getCountries().subscribe(
      (countries) => {
        this.countryList = countries;
        console.log({ countries });
      },
      (error) => {
        console.log({ error });
        swal({
          title: "Error",
          text: "No fue posible cargar los paises, por favor vuelva a intentarlo.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-danger",
          type: "error",
        });
      }
    );
  }

  getCities(): void {
    this._educationalUnitSvc.getCities().subscribe(
      (cities) => {
        this.cityList = cities;
        console.log({ cities });
      },
      (error) => {
        console.log({ error });
        swal({
          title: "Error",
          text: "No fue posible cargar las ciudades, por favor vuelva a intentarlo.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-danger",
          type: "error",
        });
      }
    );
  }

  getAcademicYears(): void {
    this.academicyearService.allAcademicyear().subscribe((data) => {
      this.academicYears = data;
      //console.log("Academia " , this.academicYears)
    });
  }
  formatAcademicYear(year: any): string {
    return `${year.month_start} a ${year.month_end} ${year.year_end}`;
  }

  openModalAUploadLogo(): void {
    const dialogRef = this.dialog.open(ModalUploadLogoComponent, {
      width: "400px",
      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log({ result });
      // Puedes hacer algo con el resultado aquí
      this.file = result;
      this.fileName = result.name;
    });
  }
  openModalUsers(): void {
    const dialogRef = this.dialog.open(ModalAddUsersUeComponent, {
      width: "1000px",

      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Puedes hacer algo con el resultado aquí
    });
  }

  async submitForm() {
    if (!this.form.valid) {
      console.log("Invalid Form");
      swal({
        title: "Error",
        text: "El formulario no es valido, por favor rectifique los valores.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-danger",
        type: "warning",
      });
      return;
    }

    console.log({ form: this.form });

    swal({
      title: "En proceso",
      text: "Registrando Unidad Educativa.",
      buttonsStyling: false,
      type: "info",
    });

    let newLogoUrl: string | null;

    if (this.file) {
      try {
        newLogoUrl = await this._educationalUnitSvc.uploadFile(
          `UnitEducational/logo_${
            this.educationalUnit ? this.educationalUnit.uid : Date.now()
          }.png`,
          this.file
        );
      } catch (error) {
        swal({
          title: "Error",
          text:
            "Hubo un error al guardar la imagen. Vuelve a intentarlo." + error,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-danger",
          type: "error",
        });

        return;
      }
    }

    try {
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
      const uid: string = this.educationalUnit
        ? this.educationalUnit.uid
        : this.libraries_date.get_timestamp_current().toString();
      await this._educationalUnitSvc.save_and_update_educational_unit(uid, {
        ...this.form.value,
        uid,
        email: "",
        plan: null,
        logo: newLogoUrl,
      });

      if (!this.educationalUnit) {
        this.form.reset();
      }

      swal({
        title: "Ok",
        text: `Datos de la UE ${
          this.educationalUnit ? "editados" : "procesados"
        } correctamente!`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      }).catch(swal.noop);
    } catch (error) {
      swal({
        title: "Error",
        text: "No fue posible registrar la Unidad Educativa, por favor vuelva a intentarlo.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-danger",
        type: "error",
      });
      this.form.reset();
      //console.log("Error")
    }
  }
}
