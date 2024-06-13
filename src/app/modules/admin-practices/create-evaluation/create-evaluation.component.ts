import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take, first, map, filter } from 'rxjs/operators';
/** MODELS */
import { Teacher } from 'app/models/teacher/teacher.model';
import { Subject } from 'app/models/class/classdocumentSubject';
import { TypePractice, OptionOfItem } from 'app/models/class/class.documenttype-practice';
import { Adminpractices } from 'app/models/class/class.documentadminpractices';
/** SERVICES */
import { SubjectService } from 'app/services/subject/subject.service'
import { AdminEvaluationService } from 'app/services/adminEvaluation/admin-evaluation.service'
import { StorageService } from 'app/services/storage/storage.service';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.component.html',
  styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {

  @Input() showNewEvaluation: Boolean;
  @Input() gradeId: String;
  @Input() subjectId: String;
  @Input() infoUser: Teacher;
  @Input() practiceId: String;
  @Input() evaluationId: String;
  @Input() isNewEvaluation: Boolean
  @Output() isReturn = new EventEmitter();

  public arrayTypePractice: any[] = [];
  public evaluation: Adminpractices;
  public Subject: Subject;
  public arrayOptionOfItem: OptionOfItem[] = [];
  public arrayItemsWithOptions: any = [];
  public id_evaluation: String;
  public arrayEvaluation: Adminpractices[];
  public arrayPracticeOption: TypePractice[];
  public scoringArrayEvaluation: Array<Number>;
  public scoringArrayQuestion: Array<Number>;
  public timeArrayQuestion: Array<String>
  public optionQuestionSelect: TypePractice;
  public arrayImagesOptions: any[] = [];
  public imageSrc: any;
  public imageFile: any;
  public showAlert = false;
  public optionSelect: string;
  public substraction: number;
  public addOtherTime = false;
  public showAlertTime: boolean;
  public scoringEvaluationSelect: number;
  public question_scoring: number;
  public editOptionStatus = false;
  public isEditScoring = false;
  public isNewOption = false;
  public countIsCorrect = 0;
  public sumOfScoreForEachQuestion = 0;
  private isInvalidSelectScoring = false;
  constructor(private subjectService: SubjectService,
    private storageService: StorageService,
    private adminEvaluationService: AdminEvaluationService) { }

  ngOnInit(): void {
    if (this.subjectId) {
      this.getSubjectId()
    }
    if (!this.isNewEvaluation) {
      console.log(this.evaluationId)
      this.id_evaluation = this.evaluationId;
      this.getPractice();
    } else {
      this.id_evaluation = '';
    }
    this.arrayItemsWithOptions = [];
    this.arrayOptionOfItem = [];
    this.arrayTypePractice = [];
    this.evaluation = {
      evaluation_name: '',
      evaluation_scoring: 0,
    };
    this.substraction = 0;
    this.scoringArrayEvaluation = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.scoringArrayQuestion = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
    this.timeArrayQuestion = ['15', '30', '60', 'Otro', 'Sin limite']

    this.getTypePractice()
  }
  public async getSubjectId() {
    this.Subject = await this.subjectService.getSubjectFromSubjectId(this.infoUser.teacher_unit_educational[0], this.subjectId)
      .pipe(take(1)).toPromise()
  }

  public async getPractice() {
    this.arrayEvaluation = []
    this.sumOfScoreForEachQuestion = 0;
    this.arrayEvaluation = await this.adminEvaluationService.getEvaluation(this.id_evaluation).pipe(take(1)).toPromise();
    this.arrayEvaluation.map((evaluation) => this.evaluation = evaluation)
    this.scoringEvaluationSelect = this.evaluation.evaluation_scoring;
    this.getpracticeOption(this.evaluation)
  }

  public async getTypePractice() {
    this.arrayTypePractice = await this.adminEvaluationService.getTypePractice().pipe(take(1)).toPromise();
    this.arrayTypePractice = this.arrayTypePractice.filter(t => t.option_name !== 'Texto')
  }

  public onChangeEvaluationScoring(e) {
    this.isNewOption = false;
    this.isEditScoring = false;
    this.isInvalidSelectScoring = false;
    console.log(this.evaluation.evaluation_scoring)
    if (!this.isNewEvaluation && e.target.value > this.scoringEvaluationSelect) {
      //  this.substraction = e.target.value - this.scoringEvaluationSelect;
      //  console.log('RESTA: EDICIÓN DE PUNTUACIÓN DE EVALUACIÓN:', this.substraction);
      this.isInvalidSelectScoring = false;
    } else if (!this.isNewEvaluation && e.target.value < this.scoringEvaluationSelect) {
      if (this.sumOfScoreForEachQuestion > e.target.value) {
        this.isInvalidSelectScoring = true;
        return;
      } else {
        this.isInvalidSelectScoring = false;
        //  this.substraction = this.sumOfScoreForEachQuestion - e.target.value;
        //  console.log('subs, edición', this.substraction);
      }
    }
  }
  public onChangescoringQuestion(e) {
    if (this.editOptionStatus) {
      if (this.question_scoring === e.target.value) {
        return;
      } else {
        this.isEditScoring = true;
        this.substraction = parseFloat(this.substraction.toString()) + parseFloat(this.question_scoring.toString())
      //  console.log('SUMA: EDICIÓN DE PUNTUACIÓN:', this.substraction);
      }
    } else {
      return;
    }
  }
  public onChangeTime(e) {
    if (e.target.value === 'Otro') {
      this.addOtherTime = true;
    }
    if (e.target.value !== 'Otro') {
      this.addOtherTime = false;
    }
  }
  public onKey(e) {
    if (e > 300 || e === ':') {
      this.showAlertTime = true;
    } else {
      this.showAlertTime = false;
      this.optionQuestionSelect.other_question_time = this.optionQuestionSelect.other_question_time;
    }
  }
  public async getpracticeOption(evaluation: Adminpractices) {
    this.arrayPracticeOption = await this.adminEvaluationService.getOptionEvaluation(evaluation).pipe(first()).toPromise();
    if (this.arrayPracticeOption && this.arrayPracticeOption.length > 0) {
      this.arrayPracticeOption.forEach(question => {
        if (question.question_time !== '15' && question.question_time !== '10' && question.question_time !== '15' && question.question_time !== 'Sin limite') {
          question.question_time = 'Otro';
        }
        if (question.question_scoring) {
          this.sumOfScoreForEachQuestion = parseFloat(this.sumOfScoreForEachQuestion.toString()) + parseFloat(question.question_scoring.toString())
        //  console.log('LA SUMA DE LA PUNTUACIÓN POR PREGUNTA', this.sumOfScoreForEachQuestion);
        }
      })
      this.getOptionOfItem();
    }
  }

  async getOptionOfItem() {
    var arrayItemsWithOptionsAux = [];
    this.arrayItemsWithOptions = [];
    this.arrayPracticeOption.forEach(async item => {
      await this.adminEvaluationService.getAllOptions(this.id_evaluation, item).subscribe(allSOptions => {
        arrayItemsWithOptionsAux = [];
        allSOptions.forEach(async opt => {
          arrayItemsWithOptionsAux.push(opt.payload.doc.data());
        });
        this.arrayItemsWithOptions.push(arrayItemsWithOptionsAux);
      })
    });

  }

  public addEvaluation() {
    if (this.id_evaluation === '') {
      this.id_evaluation = new Date().getTime().toString();
      const evaluation: Adminpractices = {
        'evaluation_id': this.id_evaluation,
        'evaluation_name': this.evaluation.evaluation_name,
        'grade_id': this.gradeId,
        'subject_id': this.subjectId,
        'public_status_practice_educational_unit': true,
        'public_status_practice': true,
        'teacher_id': this.infoUser.teacher_id,
        'unit_educational_id_from_teacher': this.infoUser.teacher_unit_educational[0],
        'evaluation_scoring': this.evaluation.evaluation_scoring,
        'test_type': 'evaluation'
      }
      this.adminEvaluationService.createEvaluation(evaluation, true)
      this.getPractice();
    } else {
      if (this.isInvalidSelectScoring) {
        swal({
          title: 'Error, no puede editar el puntaje de evaluación.',
          text: 'El total de puntuación por pregunta excede el valor de puntaje que está agregando, Debe modificar los valores de puntuación almacenados o eliminar preguntas para poder editar el valor.',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-warning',
          type: 'warning'
        }).catch(swal.noop)
        this.getPractice();
        return;
      } else {
        const evaluationEdit: Adminpractices = {
          'evaluation_name': this.evaluation.evaluation_name,
          'evaluation_scoring': this.evaluation.evaluation_scoring
        }
        this.adminEvaluationService.updateEvaluation(this.id_evaluation, evaluationEdit)
        swal({
          title: 'Ok',
          text: 'Se han editado los datos correctamente!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
        if (!this.isNewEvaluation && this.evaluation.evaluation_scoring > this.scoringEvaluationSelect) {
          this.substraction = this.evaluation.evaluation_scoring- this.scoringEvaluationSelect;
        //  console.log('RESTA: EDICIÓN DE PUNTUACIÓN DE EVALUACIÓN:', this.substraction);
        } else if (!this.isNewEvaluation && this.evaluation.evaluation_scoring < this.scoringEvaluationSelect) {
            this.substraction = this.sumOfScoreForEachQuestion - this.evaluation.evaluation_scoring;
          //  console.log('subs, edición', this.substraction);
        }
        this.getPractice();
      }
      
    }
  }
  public addPracticeOption(typePracticeName) {
    this.cleanData()
    this.isEditScoring = false;
    this.editOptionStatus = false
    // console.log('add',this.substraction)
    if (this.substraction === 0 && !this.isNewEvaluation) {
      swal({
        title: 'Error, no puede agregar mas preguntas.',
        text: 'El total de puntuación por pregunta es igual a la puntuación de la evaluación, Debe modificar los valores de puntuación almacenados para poder agregar otra pregunta.',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).then((result) => {
        if (result.value) {
          $('#ModalAddPractice').modal('hide');
        }
      })
    } else {
      var option_id = new Date().getTime().toString();
      this.optionSelect = typePracticeName;
      const typePractice: TypePractice = {
        'option_id': option_id,
        'option_name': typePracticeName,
      }
      this.adminEvaluationService.createOptionEvaluation(this.id_evaluation, typePractice, true);
      this.optionQuestionSelect = {
        option_name: typePracticeName,
        option_type: '',
        option_id: option_id,
        option_description: '',
        question_scoring: 0,
        question_time: '',
      };
      this.isNewOption = true;
      this.getPractice()
    }

  }
  public cleanData() {
    this.optionQuestionSelect = {};
    this.arrayImagesOptions = [];
    this.arrayOptionOfItem = [];
    this.imageSrc = ''
    this.imageFile = ''
    this.countIsCorrect = 0;
    this.addOtherTime = false;
    this.showAlertTime = false;
  }
  public editOption(option: TypePractice, pos) {
    this.isNewOption = false;
    this.arrayImagesOptions = [];
    this.imageSrc = ''
    this.optionSelect = option.option_name;
    this.optionQuestionSelect = option;
    this.arrayOptionOfItem = this.arrayItemsWithOptions[pos];
    this.question_scoring = this.optionQuestionSelect.question_scoring;
  //  console.log(this.question_scoring);
    this.editOptionStatus = true;
    this.countIsCorrect = 0;
    this.arrayItemsWithOptions[pos].forEach(element => {
      if (element.option_item_is_correct === true) {
        this.countIsCorrect++;
      }
    });
  }
  public selectItemPractice(practiceOption: TypePractice) {
    this.optionSelect = practiceOption.option_name
  }
  public onChangePractice(optionPracticeName) {
    this.optionSelect = optionPracticeName;
    this.addPracticeOption(optionPracticeName)
  }
  public returnShowPracticesList() {
    swal({
      title: '¿Esta seguro que desea salir?',
      text: 'No podra editar posteriormente esta evaluación ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, salir!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.isReturn.emit(true);
      }
    })
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
  public editPracticeTypeOption(optionName) {
    this.countIsCorrect = 0;
    this.optionSelect = optionName;
    const updateType: TypePractice = {
      'option_name': optionName,
      'option_id': this.optionQuestionSelect.option_id,
    }
    this.adminEvaluationService.createOptionEvaluation(this.id_evaluation, updateType, false);
    this.optionQuestionSelect.option_name = optionName;
    // console.log(this.optionQuestionSelect.question_scoring)
    this.optionIsAllFalse()
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
    // console.log('contador es correcto',this.countIsCorrect);

  }
  public validar() {
  //  console.log('Esta validando');

    this.showAlert = true;
  }
  public deleteOption(opt, pos) {
    this.editOptionStatus = false;
    this.isNewOption = false;
    this.isEditScoring = false;
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
        this.adminEvaluationService.deleteOptionFromEvaluation(this.id_evaluation, opt, this.arrayItemsWithOptions[pos]);
        this.substraction = parseFloat(this.substraction.toString()) + parseFloat(opt.question_scoring.toString())
      //  console.log('SUMA: EDICIÓN DE PUNTUACIÓN:', this.substraction);
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
        this.adminEvaluationService.deleteOptionItemFromEvaluation(this.id_evaluation, this.optionQuestionSelect, this.arrayOptionOfItem[pos]);
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
  //  console.log('Es edición', this.isEditScoring, 'Es nueva opción', this.isNewOption)
  //  console.log('valor substraction INICIAL', this.substraction)
    if (this.countIsCorrect === 0 && this.optionQuestionSelect.option_name !== 'Respuesta Específica') {
      swal({
        title: 'Error',
        text: 'No puede guardar una pregunta sin opciones correctas, Debe ingresar al menos una opción correcta',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      if (this.substraction === 0 && this.isNewEvaluation) {
        if ((this.evaluation.evaluation_scoring - this.optionQuestionSelect.question_scoring) < 0) {
          swal({
            title: 'Error',
            text: 'La puntuación de la  pregunta excede el valor de la evaluación , Debe ingresar un valor no mayor a : ' + this.evaluation.evaluation_scoring,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-fill btn-warning',
            type: 'warning'
          }).catch(swal.noop)
          return;
        } else {
          this.substraction = this.evaluation.evaluation_scoring - this.optionQuestionSelect.question_scoring;
          this.saveInformation()
        }
      } else {
        if ((this.substraction - this.optionQuestionSelect.question_scoring) < 0 && this.isEditScoring || (this.substraction - this.optionQuestionSelect.question_scoring) < 0 && this.isNewOption) {
        //  console.log('ES MENOR ')
          swal({
            title: 'Error',
            text: 'El total de puntuación por pregunta excede la puntuación de la evaluación, Debe ingresar un valor no mayor a : ' + this.substraction + ', o modificar los valores de puntuación almacenados.',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-fill btn-warning',
            type: 'warning'
          }).catch(swal.noop)
          return;
        } else if (this.isEditScoring || this.isNewOption) {
          this.substraction = this.substraction - this.optionQuestionSelect.question_scoring;
        //  console.log('no es menor, guardo')
          this.saveInformation()
        } else if (!this.isEditScoring || !this.isNewOption) {
          this.saveInformation()
        }
      }
    }
    this.isNewEvaluation = false;
    this.editOptionStatus = false;
    this.isNewOption = false;
    this.isEditScoring = false;
   console.log('valor substraction FINAL', this.substraction)
  }
  public async saveInformation() {
    let count = 0;
    if (this.imageFile) {
      this.optionQuestionSelect.question_image = await this.storageService.uploadFile(`evaluations/evaluations_${this.evaluation.evaluation_id}/question_${this.optionQuestionSelect.option_id}/img_question${this.optionQuestionSelect.option_id}.png`, this.imageFile);
    }
    if (this.countIsCorrect === 1 && this.optionQuestionSelect.option_name !== 'Respuesta Específica') {
      this.optionQuestionSelect.option_name = 'Opción Múltiple'
    }
    this.arrayOptionOfItem.forEach(async option => {
      if (this.optionQuestionSelect.option_name === 'Respuesta Específica') {
        option.option_item_is_correct = true;
        option.option_scoring = this.optionQuestionSelect.question_scoring / this.arrayOptionOfItem.length;
      }
      if (option.option_item_is_correct === true && this.optionQuestionSelect.option_name !== 'Respuesta Específica') {
        option.option_scoring = this.optionQuestionSelect.question_scoring / this.countIsCorrect;
      } else if (option.option_item_is_correct === false && this.optionQuestionSelect.option_name !== 'Respuesta Específica') {
        option.option_scoring = 0;
      }
      if (option.option_item_img_provisional) {
        option.option_item_image = await this.storageService.uploadFile(`evaluations/evaluations_${this.evaluation.evaluation_id}/question_${this.optionQuestionSelect.option_id}/img_option${option.option_item_id}.png`, option.option_item_img_provisional)
        await this.adminEvaluationService.createOptionItemEvaluation(this.id_evaluation, this.optionQuestionSelect, this.arrayOptionOfItem);
      }
      count++;
      if (this.arrayOptionOfItem.length === count) {
        this.getPractice()
        $('#ModalAddPractice').modal('hide');
      }

    })
    await this.adminEvaluationService.createOptionItemEvaluation(this.id_evaluation, this.optionQuestionSelect, this.arrayOptionOfItem);
    this.adminEvaluationService.createQuestionEvaluation(this.id_evaluation, this.optionQuestionSelect, false);
    swal({
      title: 'Ok',
      text: 'Se guardaron los datos correctamente!',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-fill btn-success',
      type: 'success'
    }).catch(swal.noop)
    this.showAlert = false;
  }
  public cancel() {
    if (this.optionQuestionSelect.question_scoring && !this.isNewOption) {
      $('#ModalAddPractice').modal('hide');
      this.getPractice()
    } else  {
      swal({
        title: '¿Está seguro que desea salir?',
        text: 'Se eliminaran los datos agregados',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
        cancelButtonClass: 'btn btn-fill btn-danger',
        confirmButtonText: 'Sí, salir!',
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          $('#ModalAddPractice').modal('hide');
          this.adminEvaluationService.removeOptionWithoutItems(this.id_evaluation, this.optionQuestionSelect);
          this.getPractice()
          this.cleanData()
        }
      })
      this.isEditScoring = false;
      this.editOptionStatus = false
    }
  
    //if (!this.optionQuestionSelect.option_description) {
    //  this.adminEvaluationService.removeOptionWithoutItems(this.id_evaluation, this.optionQuestionSelect);
    //}
    //  this.arrayPracticeOption = [];
    //this.showAlert = false;
    //this.imageSrc = ''
    //this.imageFile = ''
    //this.countIsCorrect = 0;
  //  this.cleanData()
  }
}
