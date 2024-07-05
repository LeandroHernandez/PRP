import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';
import { UnitEdicationalService } from 'app/services/unit-edicational/unit-edicational.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { ModalUploadLogoComponent } from '../modal-upload-logo/modal-upload-logo.component';
import { ShareDataService } from 'app/services/ShareData/share-data.service';
import { AcademicYearService } from 'app/services/academic_year/academic-year.service';
import {StorageService} from 'app/services/storage/storage.service';
import { AuthService } from 'app/services/login/auth.service';
import swal from 'sweetalert2';
import { FirebaseService } from 'app/services/firebaseService/firebase-service.service';
import { ValidationService } from 'app/services/validationRuc/validation.service';
import { ModalAddUsersUeComponent } from '../modal-add-users-ue/modal-add-users-ue.component';


@Component({
  selector: 'app-modal-add-new-ue',
  templateUrl: './modal-add-new-ue.component.html',
  styleUrls: ['./modal-add-new-ue.component.css']
})


export class ModalAddNewUEComponent implements OnInit, OnDestroy {
  
  file: File | null = null;
  subscription: Subscription;
  fileName: string = '';
  unidadEducativa: UnitEducational;
  public listCountries = [];
  public listCities = [];
  form: FormGroup;
  products: string[] = ['Producto 1', 'Producto 2', 'Producto 3'];
  academicYears: any[] = [];
  public isEdit: boolean = false;
  public unitEducational: UnitEducational;


  constructor(
    private dialog: MatDialog, private shareDataService: ShareDataService,
    private unitEdicationalService: UnitEdicationalService, 
    private academicyearService: AcademicYearService, private storageService: StorageService, 
    public auth: AuthService, private firebaseService: FirebaseService,  
    private validationService: ValidationService) {
   }

  ngOnInit(): void {
    this.subscription = this.shareDataService.file$.subscribe(file => {
      this.file = file;
      if (file != null) {
        this.fileName = file.name;  // Almacenar el nombre del archivo en la variable
        //console.log('Archivo recibido:', file.name);
      } else {
        this.fileName = '';  // Limpiar el nombre si no hay archivo
      }
    });
   
    this.unidadEducativa = new UnitEducational({});
    this.getCountries();
    this.getCities();
    this.initForm();
    this.getAcademicYears();
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** Valida el ruc en el form agregar nueva UE */
  rucValidator(): ValidatorFn  {
    return (control: AbstractControl): ValidationErrors | null => {
      const ruc = control.value;
      if (!this.validationService.validateRuc(ruc)) {
        return { invalidRuc: true };
      }
      return null;
    };
  }

  // Abrir Modal para seleccionar un logo para UE
  openModalAUploadLogo(): void {
    const dialogRef = this.dialog.open(ModalUploadLogoComponent, {
      width: '400px',
      disableClose: true // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe(result => {
      // Puedes hacer algo con el resultado aquí
    });
  }
  openModalUsers(): void {
    const dialogRef = this.dialog.open(ModalAddUsersUeComponent, {
      width: '1000px',
      
      disableClose: true // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe(result => {
      // Puedes hacer algo con el resultado aquí
    });
  }

  // OBTENER LISTADO DE PAISES
  public getCountries() {
    this.unitEdicationalService.getCountries().subscribe(data => {
      this.listCountries = data;
    });
  }

  // OBTENER LISTADO DE CIUDADES
  public getCities() {
    this.unitEdicationalService.getCities().subscribe(data => {
      this.listCities = data;
    });
  }


  /**Validamos antes de guardar la Unidad Educativa */
  async validateAndSave(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
       // Marca todos los controles como tocados para activar los mensajes de error
      //console.error('The form contains errors.');
      swal({
        title: 'Error',
        text: 'El formulario contiene errores.',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-danger',
        type: 'error',
      })
      return;
    }
  
    const formData: UnitEducational = {
      ...this.form.value,
      unit_educational_status: this.form.value.unit_educational_status || false,
      unit_educational_city: this.form.value.unit_educational_city || '',
    };
  
    await this.save(formData, this.form.valid);
  }
   
  /**
    * Guardamos una nueva UE
    * @param unitEdicational
    * @param isValid
  */
  async save(unitEducational: UnitEducational, isValid: boolean): Promise<void> {
    let newLogoUrl: string | undefined;
  
    if (this.file) {
      try {
        newLogoUrl = await this.unitEdicationalService.uploadFile(
          `UnitEducational/logo_${unitEducational.unit_educational_id || Date.now()}.png`, this.file
        );
      } catch (error) {
        swal({
          title: 'Error',
          text: 'Hubo un error al guardar la imagen. Vuelve a intentarlo.' + error,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-danger',
          type: 'error',
        });

        return;
      }
    }
  
    // Solo actualiza el logo si se ha subido una nueva imagen
    if (newLogoUrl) {
      unitEducational.unit_educational_logo = newLogoUrl;
    }
  
    try {
      //await this.firebaseService.initializeFirestoreConnection();
  
      if (this.isEdit) {
        await this.unitEdicationalService.saveUnitEducational(unitEducational, false);
        //console.log("entre al if")
      } else {
        //console.log("entre la else")

        await this.unitEdicationalService.saveUnitEducational(unitEducational, true);
      }
  
      this.form.reset();
      swal({
        title: 'Ok',
        text: this.isEdit ? 'Datos de la UE editados correctamente!' : 'Datos de la UE procesados correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success',
      }).catch(swal.noop);
    } catch (error) {
      //console.log("Error")
    }
  }

  initForm(){
    this.form = new FormGroup({
      'unit_educational_id': new FormControl(this.unidadEducativa.unit_educational_id),
      'unit_educational_status': new FormControl(this.unidadEducativa.unit_educational_status),
      'unit_educational_name': new FormControl(this.unidadEducativa.unit_educational_name, Validators.required),
      'unit_educational_country': new FormControl(this.unidadEducativa.unit_educational_country, Validators.required),
      'unit_educational_city': new FormControl(this.unidadEducativa.unit_educational_city, Validators.required),
      'unit_educational_address': new FormControl(this.unidadEducativa.unit_educational_address, Validators.required),
      'unit_educational_academy': new FormControl(this.unidadEducativa.unit_educational_academy, Validators.required),
      'unit_educational_ruc': new FormControl(this.unidadEducativa.unit_educational_ruc, [Validators.required, this.rucValidator()]),
      'unit_educational_product': new FormControl(this.unidadEducativa.unit_educational_product, Validators.required),
      'unit_educational_value': new FormControl(this.unidadEducativa.unit_educational_value, Validators.required),
      'unit_educational_phone': new FormControl(this.unidadEducativa.unit_educational_phone, Validators.required),
      'unit_educational_phoneBill': new FormControl(this.unidadEducativa.unit_educational_phoneBill, Validators.required),
      'unit_educational_academyId_fk': new FormControl(this.unidadEducativa.unit_educational_academyId_fk, Validators.required),
      'moduloNoticias': new FormControl(false),
      'moduloEntrenamiento': new FormControl(false),
      'moduloCampeonatos': new FormControl(false),
      'moduloControlPagos': new FormControl(false)
    });
  }

  getAcademicYears(): void {
    this.subscription = this.academicyearService.allAcademicyear().subscribe(data => {
      this.academicYears = data;
      //console.log("Academia " , this.academicYears)
    });
  }

  /** Metodo para formatear los datos y poner seleccionar un periodo */
  formatAcademicYear(year: any): string {
    return `${year.month_start} a ${year.month_end} ${year.year_end}`;
  }
}