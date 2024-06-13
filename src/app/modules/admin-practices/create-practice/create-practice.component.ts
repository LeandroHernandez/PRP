import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { take, first } from 'rxjs/operators';
import swal from 'sweetalert2';
/** SERVICE */
import { AdminPracticeService } from 'app/services/adminPractice/admin-practice.service';
import { StorageService } from 'app/services/storage/storage.service';
import { SubjectService } from 'app/services/subject/subject.service'
/**MODELS */
import { Adminpractices } from 'app/models/class/class.documentadminpractices'
import { TypePractice } from 'app/models/class/class.documenttype-practice'
import { OptionOfItem } from '../../../models/class/class.documenttype-practice';
import { Teacher } from 'app/models/teacher/teacher.model';
import { Subject } from 'app/models/class/classdocumentSubject';

declare var $: any;
@Component({
  selector: 'app-create-practice',
  templateUrl: './create-practice.component.html',
  styleUrls: ['./create-practice.component.css']
})
export class CreatePracticeComponent implements OnInit {
  @Input() gradeId: String;
  @Input() subjectId: String;
  @Input() shownewPractice:Boolean;
  @Input() infoUser: Teacher;
  @Input() practiceId: String;
  @Input() isNewPractice: Boolean;
  @Output() isReturn = new EventEmitter();

  public arrayTypePractice: TypePractice[] = [];
  public practice: Adminpractices;
  public arrayPractice: Adminpractices[];
  public arrayPracticeOption: TypePractice[];
  public optionPractice: TypePractice;
  public optionSelect: string;
  public optionPracticeSelect: TypePractice;
  public imageSrc: any;
  public imageFile: any;
  public isImageQuestion: boolean;
  public imageOptionSelect: Array<any> = [];
  public arrayOptionOfItem: OptionOfItem[] = [];
  public arrayImagesOptions: any[] = []
  public id_practic: String;
  public arrayItemsWithOptions: any  = [];
  public practice_name: string;
  public images: Array<Object> = [];
  public numberOfAttemps: any;
  public Subject: Subject;
  public showAlert = false;
  public countIsCorrect = 0;

  constructor(private adminPracticeService: AdminPracticeService,
    private storageService: StorageService,
    private subjectService: SubjectService) {
  }

  ngOnInit(): void {
    // console.log(this.practiceId)
    if (this.subjectId) {
      this.getSubjectId()
    }
    if (this.isNewPractice) {
      this.id_practic = '';
    }
    if (!this.isNewPractice) {
     this.id_practic = this.practiceId;
    //  this.getPractice()
    }
    this.getPractice();
    this.arrayItemsWithOptions = [];
    this.arrayOptionOfItem = [];
    this.arrayTypePractice = [];
    this.practice = {
      practice_name : '',
    };
    this.getTypePractice()
    this.numberOfAttemps = [1, 2, 4, 6, 8, 10, 'Ilimitados']
  }


  public async  getSubjectId() {
   this.Subject = await this.subjectService.getSubjectFromSubjectId(this.infoUser.teacher_unit_educational[0], this.subjectId).pipe(take(1)).toPromise()
  }
  public async getPractice() {
    this.arrayPractice = []
    this.arrayPractice = await this.adminPracticeService.getPractice(this.id_practic).pipe(take(1)).toPromise();
    this.arrayPractice.map((practice) => this.practice = practice)
    this.getpracticeOption(this.practice)
  }

  public async getTypePractice() {
    this.arrayTypePractice = await this.adminPracticeService.getTypePractice().pipe(take(1)).toPromise();
  }

  public editPracticeTypeOption(optionName) {
    this.optionSelect = optionName;
    const updateType: TypePractice = {
      'option_name': optionName,
      'option_id': this.optionPracticeSelect.option_id
    }
    this.adminPracticeService.createOptionPractice(this.id_practic, updateType, false);
    this.optionPracticeSelect.option_name = optionName;
    this.optionIsAllFalse()
  }

  public async getpracticeOption(practice: Adminpractices) {
    this.arrayPracticeOption = await this.adminPracticeService.getOptionPractice(practice).pipe(first()).toPromise();
    if (this.arrayPracticeOption) {
      this.getOptionOfItem();
    }
  }

  async getOptionOfItem() {
    var arrayItemsWithOptionsAux = [];
    this.arrayItemsWithOptions = [];
    this.arrayPracticeOption.forEach(async item => {
      await this.adminPracticeService.getAllOptions(this.id_practic, item).subscribe(allSOptions => {
        arrayItemsWithOptionsAux = [];
        allSOptions.forEach(async opt => {
          arrayItemsWithOptionsAux.push(opt.payload.doc.data());
        });
        this.arrayItemsWithOptions.push(arrayItemsWithOptionsAux);
      })
    });

  }

  public validar() {
    this.showAlert = true;
  }
  public cleanData() {
    this.optionPracticeSelect = {};
    this.arrayImagesOptions = [];
    this.arrayOptionOfItem = [];
    this.imageSrc = '';
    this.imageFile = '';
    this.countIsCorrect = 0;
  }
  public addPractice() {
    if (this.id_practic === '') {
      this.id_practic = new Date().getTime().toString();
      const practice: Adminpractices = {
        'practice_id': this.id_practic,
        'practice_name': this.practice.practice_name,
        'grade_id': this.gradeId,
        'subject_id': this.subjectId,
        'public_status_practice_educational_unit': true,
        'public_status_practice': true,
        'teacher_id': this.infoUser.teacher_id,
        'unit_educational_id_from_teacher': this.infoUser.teacher_unit_educational[0],
      }
      this.adminPracticeService.createPractice(practice, true)
      this.getPractice();
    } else {
      this.adminPracticeService.uddateNamePractice(this.id_practic, this.practice.practice_name)
    }
  }

  public addPracticeOption(typePracticeName) {
    this.cleanData()
    var option_id = new Date().getTime().toString();
    this.optionSelect = typePracticeName;
    const typePractice: TypePractice = {
      'option_id': option_id,
      'option_name': typePracticeName,
    }
    this.adminPracticeService.createOptionPractice(this.id_practic, typePractice, true);
    this.optionPracticeSelect = {
      option_name: typePracticeName,
      option_type: '',
      option_id: option_id,
      option_description: '',
    };

    this.getPractice()
  }

  public onChangePractice(optionPracticeName) {
    this.optionSelect = optionPracticeName;
    this.addPracticeOption(optionPracticeName)
  }

  public onChangeImage(event, isImageQuestion: boolean, opt?: any) {
    if (isImageQuestion) {
      const file = event.srcElement.files;
      if (file && file.length > 0) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        }
        reader.readAsDataURL(file[0]);
        this.uploadImageOfQuestion(event)
      }
    } else {
      const files = event.srcElement.files;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.arrayImagesOptions[opt] = e.target.result
        }
        reader.readAsDataURL(files[0]);
        this.upload(event, opt)

      }
    }
  }
  public async uploadImageOfQuestion(event) {
    const file = await event.target.files[0];
    this.imageFile = await file;
    this.imageSrc = ''
  }
  public async upload(event, optIndex?) {
    const files = await event.target.files[0];
    this.arrayOptionOfItem[optIndex].option_item_img_provisional = await files
  }

  public selectItemPractice(practiceOption: TypePractice) {
    this.optionSelect = practiceOption.option_name
 //   console.log(this.optionSelect)
  }

  public editOption(option: TypePractice, pos) {
    this.arrayImagesOptions = [];
    this.imageSrc = ''
    this.optionSelect = option.option_name;
    this.optionPracticeSelect = option;
    this.arrayOptionOfItem = this.arrayItemsWithOptions[pos];
  }

  public optionIsAllFalse() {
    this.arrayOptionOfItem.forEach(opt => {
      opt.option_item_is_correct = false;
    });
  }
  public addOptionOfItem() {
    this.arrayOptionOfItem.push(
      {
        option_item_description: '',
        option_item_order: '',
        option_item_id: new Date().getTime().toString(),
        option_item_is_correct: false,
      }
    );
  }

  public optionIsCorrect(opt) {
    this.arrayOptionOfItem.forEach(opt => {
      opt.option_item_is_correct = false;
    });
    opt.option_item_is_correct = !opt.option_item_is_correct;
    this.countIsCorrect = 1;
  }

  public optionMultipleIsCorrect(opt) {
    opt.option_item_is_correct = !opt.option_item_is_correct;
    if (opt.option_item_is_correct === true) {
      this.countIsCorrect++
    } else {
      this.countIsCorrect--;
    }
  }

  public deleteOption(opt, pos) {
    swal({
      title: 'Desea eliminar esta pregunta?',
      text: '',
      type: 'info',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.adminPracticeService.deleteOption(this.id_practic, opt, this.arrayItemsWithOptions[pos]);
        this.getPractice();
        swal({
          title: 'Ok',
          text: 'Opción eliminada!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }

  public deleteOptionItem(pos) {
    swal({
      title: 'Desea eliminar esta opción?',
      text: '',
      type: 'info',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.adminPracticeService.deleteOptionItem(this.id_practic, this.optionPracticeSelect, this.arrayOptionOfItem[pos]);
        this.arrayOptionOfItem.splice(pos, 1);
        swal({
          title: 'Ok',
          text: 'Opción eliminada!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }
  public async saveOptionItem() {
    let count = 0;
    if (this.countIsCorrect === 0 && this.arrayOptionOfItem.length === 0 && this.optionPracticeSelect.option_name !== 'Texto' && this.optionPracticeSelect.option_name !== 'Respuesta Específica'
    || this.arrayOptionOfItem.length === 0 && this.optionPracticeSelect.option_name === 'Respuesta Específica' || this.countIsCorrect === 0 && this.optionPracticeSelect.option_name !== 'Texto' && this.optionPracticeSelect.option_name !== 'Respuesta Específica') {
      swal({
        title: 'Error',
        text: 'No puede guardar una pregunta sin opciones, Debe ingresar al menos una opción y una opción correcta',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      if (this.imageFile) {
        this.optionPracticeSelect.question_image = await this.storageService.uploadFile(`practices/practice_${this.practice.practice_id}/question_${this.optionPracticeSelect.option_id}/img_question${this.optionPracticeSelect.option_id}.png`, this.imageFile);
      }
      if (this.optionPracticeSelect.option_name === 'Texto') {
        this.arrayOptionOfItem = []
        this.getPractice()
        $('#ModalAddPractice').modal('hide');
      }
      this.arrayOptionOfItem.forEach(async option => {
        if (this.optionPracticeSelect.option_name === 'Respuesta Específica') {
            option.option_item_is_correct = true;
        }
        if (option.option_item_img_provisional) {
          option.option_item_image = await this.storageService.uploadFile(`practices/practice_${this.practice.practice_id}/question_${this.optionPracticeSelect.option_id}/img_option${option.option_item_id}.png`, option.option_item_img_provisional)
          await this.adminPracticeService.createOptionItem(this.id_practic, this.optionPracticeSelect, this.arrayOptionOfItem);
        }
        count++;
        if (this.arrayOptionOfItem.length === count) {
          this.getPractice()
          $('#ModalAddPractice').modal('hide');
        }
      })
      await this.adminPracticeService.createOptionItem(this.id_practic, this.optionPracticeSelect, this.arrayOptionOfItem);
      this.adminPracticeService.createOptionPractice(this.id_practic, this.optionPracticeSelect, false);
      swal({
        title: 'Ok',
        text: 'Se guardaron los cambios correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop)
      this.showAlert = false;
    }
  
  }

  public cancel() {
    if (!this.optionPracticeSelect.option_description) {
      this.adminPracticeService.removeOptionWithoutItems(this.id_practic, this.optionPracticeSelect);
    }
    this.arrayPracticeOption = [];
    this.showAlert = false;
    this.cleanData()
    this.getPractice()
  }
  public returnShowPractices() {
    this.isReturn.emit(true);
  }
}
