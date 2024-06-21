import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';
import { UnitEdicationalService } from 'app/services/unit-edicational/unit-edicational.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalUploadLogoComponent } from '../modal-upload-logo/modal-upload-logo.component';
import { ShareDataService } from 'app/services/ShareData/share-data.service';
import { AcademicYearService } from 'app/services/academic_year/academic-year.service';
import {StorageService} from 'app/services/storage/storage.service';
import { AuthService } from 'app/services/login/auth.service';
import swal from 'sweetalert2';
import { FirebaseService } from 'app/services/firebaseService/firebase-service.service';

@Component({
  selector: 'app-modal-add-new-ue',
  templateUrl: './modal-add-new-ue.component.html',
  styleUrls: ['./modal-add-new-ue.component.css']
})


export class ModalAddNewUEComponent implements OnInit, OnDestroy {
  
  selectedAcademyId = '';
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
    public auth: AuthService, private firebaseService: FirebaseService) {
   }

  ngOnInit(): void {
    this.subscription = this.shareDataService.file$.subscribe(file => {
      this.file = file;
      if (file) {
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

  // Abrir Modal para seleccionar un logo para UE
  openModalAUploadLogo(): void {
    const dialogRef = this.dialog.open(ModalUploadLogoComponent, {
      width: '500px',
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


  async validateAndSave(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched(); // Marca todos los controles como tocados para activar los mensajes de error
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
    if (this.file) {
      try {
        unitEducational.unit_educational_logo = await this.storageService.uploadFile(
          `UnitEducational/${unitEducational.unit_educational_name}/logo_${unitEducational.unit_educational_id}.png`,
          this.file
        );
      } catch (error) {
        //console.error('Error uploading image:', error);
        swal({
          title: 'Error',
          text: 'Hubo un error al guardar la imagen. Vuelve a intentarlo.',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-danger',
          type: 'error',
        })
        return;
      }
    } else {
      unitEducational.unit_educational_logo = this.unidadEducativa.unit_educational_logo || '';
    }

    try {
      // Inicializar la conexión a Firestore antes de guardar los datos
        await this.firebaseService.initializeFirestoreConnection();
      
      if (this.isEdit) {
        await this.unitEdicationalService.saveUnitEducational(unitEducational, false);
        // Limpiar el formulario después de guardar
        this.form.reset();
      } else {
        await this.auth.registerUserAuth(unitEducational, true);
        await this.unitEdicationalService.saveUnitEducational(unitEducational, true);
        // Limpiar el formulario después de guardar
        this.form.reset();
      }
      //console.log('Data successfully saved or updated.');
    } catch (error) {
      //console.error('Error saving or updating data:', error);
      swal({
        title: 'Error',
        text: 'Hubo un error al guardar los datos. Vuelve a intentarlo.',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-danger',
        type: 'error',
      })
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
      'unit_educational_ruc': new FormControl(this.unidadEducativa.unit_educational_ruc, Validators.required),
      'unit_educational_product': new FormControl(this.unidadEducativa.unit_educational_product, Validators.required),
      'unit_educational_value': new FormControl(this.unidadEducativa.unit_educational_value, Validators.required),
      'unit_educational_email': new FormControl(this.unidadEducativa.unit_educational_email, [Validators.required, Validators.email]),
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

  formatAcademicYear(year: any): string {
    return `${year.month_start} a ${year.month_end} ${year.year_end}`;
  }
}