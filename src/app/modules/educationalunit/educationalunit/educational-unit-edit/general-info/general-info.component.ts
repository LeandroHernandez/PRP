import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Librariesdate } from "app/libraries/class/class.librariesdate";
import { ModalUploadLogoComponent } from "app/modals/modal-upload-logo/modal-upload-logo.component";
import { ICity } from "app/models/interfaces/city";
import { ICountry } from "app/models/interfaces/country";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";
import swal from "sweetalert2";

@Component({
  selector: "app-general-info",
  templateUrl: "./general-info.component.html",
  styleUrls: ["./general-info.component.css"],
})
export class GeneralInfoComponent implements OnInit {
  @Input() educationalUnit: IEducationalUnit | null = null;
  @Output() educationalUnitEmitter: EventEmitter<IEducationalUnit> =
    new EventEmitter();
  public libraries_date = new Librariesdate();

  public countryList: ICountry[] = [];
  public cityList: ICity[] = [];

  public selectedFile: File | null = null;
  public fileName: string = "";

  public form: FormGroup = this._fb.group({
    uid: ["", [Validators.required]],
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    plan: [null, [Validators.required]],
    country: ["", [Validators.required]],
    city: ["", [Validators.required]],
    // academicDiscipline: ["", [Validators.required]],
    // ruc: [
    //   "",
    //   [
    //     Validators.minLength(13),
    //     Validators.maxLength(13),
    //     Validators.pattern(/001$/),
    //     Validators.required,
    //   ],
    // ],
    // product: ["", [Validators.required]],
    // value: [null, [Validators.min(0), Validators.required]],
    // billPhone: [
    //   null,
    //   [Validators.minLength(5), Validators.maxLength(15), Validators.required],
    // ],
    phoneNumber: [
      null,
      [Validators.minLength(5), Validators.maxLength(15), Validators.required],
    ],
    address: ["", [Validators.required]],
    logo: [""],
    // modules: this._fb.group({
    //   newsModule: [false, [Validators.required]],
    //   trainingModule: [false, [Validators.required]],
    //   copsModule: [false, [Validators.required]],
    //   payControlModule: [false, [Validators.required]],
    // }),
    // academicYearId: ["", [Validators.required]],
    state: [false, [Validators.required]],
  });

  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,
    private _educationalUnitSvc: EducationalUnitService
  ) {}

  ngOnInit(): void {
    if (this.educationalUnit) {
      this.initForm(this.educationalUnit);
    }
    this.getCountries();
    this.getCities();
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

  public initForm(educationalUnit: IEducationalUnit) {
    this.form.setValue({
      uid:
        educationalUnit.uid ??
        this.libraries_date.get_timestamp_current().toString(),
      name: educationalUnit.name,
      email: educationalUnit.email ?? "",
      plan: educationalUnit.plan ?? null,
      country: educationalUnit.country,
      city: educationalUnit.city,
      phoneNumber: educationalUnit.phoneNumber,
      address: educationalUnit.address,
      logo: educationalUnit.logo,
      state: educationalUnit.state,
    });
  }

  openModalEditLogo(): void {
    const dialogRef = this.dialog.open(ModalUploadLogoComponent, {
      width: "400px",
      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedFile = result;
      //console.log("modal cerrrdo Edit Logo")
    });
  }

  async editUE(educationalUnit: IEducationalUnit) {
    if (!this.form.valid) {
      swal({
        title: "Formulario Invalido",
        text: "El formulario es invalido, por favor rectifique los valores.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-error",
        type: "warning",
      });
      return;
    }
    try {
      // Solo procesar la imagen si hay un nuevo archivo seleccionado
      if (this.selectedFile) {
        // Borrar la imagen anterior si existe
        this.deleteLogo(educationalUnit);

        // Subir la nueva imagen
        const newFilePath = `educationalUnit/logo_${
          educationalUnit.uid
        }_${Date.now()}.png`;
        const newLogoUrl = await this._educationalUnitSvc.uploadFile(
          newFilePath,
          this.selectedFile
        );

        // Actualizar la URL del logo en el objeto educationalUnit
        educationalUnit.logo = newLogoUrl;
        this.form.get("logo").setValue(newLogoUrl);

        // Limpiar la selección de archivo
        this.selectedFile = null;
        this.fileName = "";

        // this.updateView();
      }

      const data: IEducationalUnit = {
        ...educationalUnit,
        ...this.form.value,
      };
      await this._educationalUnitSvc
        .save_and_update_educational_unit(educationalUnit.uid, data)
        .then(() => this.educationalUnitEmitter.emit(data));

      swal({
        title: "Éxito",
        text: "La unidad educativa se ha actualizado correctamente.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      });
    } catch (error) {
      console.error("Error al editar la unidad educativa:", error);
      swal({
        title: "Error",
        text: "Hubo un error al actualizar la unidad educativa. Por favor, inténtalo de nuevo.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-danger",
        type: "error",
      });
    }
  }

  deleteLogo(educationalUnit: IEducationalUnit) {
    if (educationalUnit && educationalUnit.logo) {
      const fullUrl = educationalUnit.logo;

      // Extraer el nombre del archivo de la URL
      const urlParts = fullUrl.split("educationalUnit%2F");
      if (urlParts.length > 1) {
        const fileName = urlParts[1].split("?")[0];
        const oldFilePath = `educationalUnit/${decodeURIComponent(fileName)}`;
        try {
          this._educationalUnitSvc.deleteFile(oldFilePath);
          console.log("Imagen anterior borrada con éxito");
        } catch (deleteError) {
          console.error("Error al borrar la imagen anterior:", deleteError);
        }
      } else {
        console.error("No se pudo extraer el nombre del archivo de la URL");
      }
    } else {
      console.log("No hay logo para borrar");
    }
  }
}
