import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, HostListener } from '@angular/core';
/**Service */
import { AdminPracticeService } from 'app/services/adminPractice/admin-practice.service';
import { StudentSubjectsService } from 'app/services/student-subjects/student-subjects.service'
import { take } from 'rxjs/operators';
import swal from 'sweetalert2';

/** MODELS */
import { Student } from 'app/models/student/student.model';
import { Subject } from 'app/models/class/classdocumentSubject';
import { Resourcesdocum } from 'app/models/class/class.documentresources';
import { TypePractice, OptionOfItem } from 'app/models/class/class.documenttype-practice';
import { InformationPracticeQuestion } from 'app/models/class/class.document-informationPracticeQuestion'
import { Adminpractices } from 'app/models/class/class.documentadminpractices';

declare var $: any;
@Component({
  selector: 'app-do-student-practice',
  templateUrl: './do-student-practice.component.html',
  styleUrls: ['./do-student-practice.component.css']
})
export class DoStudentPracticeComponent implements OnInit {

  @Input() student: Student;
  @Input() practiceId: String;
  @Input() showViewPractice: Boolean;
  @Input() subject: Subject;
  @Input() activeUnit: any;
  @Input() resourcedocum: Resourcesdocum;
  @Input() idIntent: String;
  @Output() isReturn = new EventEmitter();
  @Output() isReturnFinish = new EventEmitter();

  public practice: Adminpractices[];
  public practiceName: String;
  public allOptionsFromPractice: Array<TypePractice>;
  public allOptionsFromOption: Array<Object> = [];
  public arrayItemsWithOptions: any[];
  public arrayOptionsReply: Array<any> = [];
  public isCorrect = false;
  public responseArray = [];
  public resText = ''
  public count = 0;
  public countAttempts = 0;
  public arrayRes = [];
  public studentAttempts: number;
  public questionAttempts: String;
  public infoActivityQuestion: InformationPracticeQuestion;
  public disableQuestion = false;
  public startTime: any;
  public endTime: any;
  public optionId: String;
  public time: any;
  public practiceAttemptsId: String;
  public numberOfError: number = 0;
  public replyText: Boolean;
  public practiceInformation: Adminpractices[];
  public questionInformation: TypePractice[];
  public arrayOptionsIsCorrect = [];
  public arrayOptionsIsfalse = []
  arrayIsCorrect: any;
  constructor(private adminPracticeService: AdminPracticeService,
    private studentSubjectService: StudentSubjectsService) { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: { [practiceId: string]: SimpleChange }) {

    if (this.practiceId) {
      this.view_practice_questions(this.practiceId)
      $('#ModalPracticeDetail').modal('show')

    }
    this.count = this.count + 1;
  }
  public async view_practice_questions(practice_id: String) {
    this.practice = await this.adminPracticeService.getPractice(practice_id).pipe(take(1)).toPromise()
    this.practiceInformation = this.practice;
    this.practiceName = this.practice.map((p) => p.practice_name).toLocaleString()
    this.getOptionsFromPractice(this.practice);
  }
  /** INICIALIZA EL WIZARD */
  private initWizard() {
    $('#wizardCard' + this.count).bootstrapWizard({
      tabClass: 'nav nav-pills',
      nextSelector: '.btn-next',
      lastSelector: '.btn-finish',
      onInit: function (tab, navigation, index) {
        //check number of tabs and fill the entire row
        var $total = navigation.find('li').length;
        var $width = 100 / $total;
        var $display_width = $(document).width();
        if ($display_width < 900 && $total > 3) {
          $width = 90;
        }

        navigation.find('li').css('width', $width + '%');
      },
      onTabClick: function (tab, navigation, index) {
        // Disable the posibility to click on tabs
        return false;
      },
      onTabShow: function (tab, navigation, index) {
        var $total = navigation.find('li').length;
        var $current = index + 1;
        var wizard = navigation.closest('.card-wizard');
        if ($current >= $total) {
          $(wizard).find('.btn-next').hide();
          $(wizard).find('.btn-finish').show();
        } else {
          $(wizard).find('.btn-next').show();
          $(wizard).find('.btn-finish').hide();
        }
      },
      onLast: function (tab, navigation, index) {
        swal("Buen Trabajo!", "Haz culminado la práctica!", "success");

      }
    });
  }
  /** OBTIENE LISTADO DE OPCIONES POR PREGUNTA */
  public async getOptionsFromPractice(practice: Adminpractices[]) {
    this.practiceId = practice.map((p) => p.practice_id).toLocaleString();
    this.allOptionsFromPractice = await this.adminPracticeService.getOptionsFromPractice(this.practiceId).pipe(take(1)).toPromise();
    this.startTime = new Date().getTime() / 1000;
    this.practiceAttemptsId = new Date().getTime().toString();
    this.getItemsFromOption();

  }
  /** OBTIENE LISTADO DE ITEMS POR PREGUNTA  Y SE INICIALIZA CONTADOR*/
  public getItemsFromOption() {
    let i = 0;
    this.arrayItemsWithOptions = [];
    this.allOptionsFromPractice.forEach(async option => {
      this.allOptionsFromOption = await this.adminPracticeService.getAllOptionsFromOption(this.practiceId, option)
        .pipe(take(1)).toPromise();
      i = i + 1
      this.initWizard()
      this.arrayItemsWithOptions.push(this.allOptionsFromOption);
    //  console.log(this.arrayItemsWithOptions);
      this.contOptionsCorrect();
    })

  }

  contOptionsCorrect() {
    var i = 0;
    this.arrayIsCorrect = [];
    this.arrayItemsWithOptions.forEach(element => {
      this.arrayIsCorrect[i] = 0;
    //  console.log(element.length);
      if (element.length == 0) {
        this.arrayIsCorrect[i] = 0;
      } else {
        element.forEach(elements => {
    //      console.log(elements.option_item_is_correct);
          if (elements.option_item_is_correct) {
            this.arrayIsCorrect[i] = this.arrayIsCorrect[i] + 1
          }
        });
      }

      i++;
    });
  }

  /** DETECTAR CAMBIO DE OPCIÓN RESPUESTA */
  public onChangeReply(e, optionReply, indice, j) {
    var $item = $('#item_' + indice + '_' + j);
    if (e == true) {
      $item.addClass("cardSelect")
      // $item.css('box-shadow','inset -1px 1px 13px 0px rgba(62,156,173,1)');
    } else {
      $item.removeClass("cardSelect");
      // box-shadow: inset -1px 1px 13px 0px rgba(62,156,173,1);
    }


    this.optionId = this.allOptionsFromPractice[indice].option_id;
    this.questionInformation = [this.allOptionsFromPractice[indice]];
    const questionOptionsCorrect = this.arrayItemsWithOptions[indice].filter(i => i.option_item_is_correct === true);
    if (e === true) {
      if (this.arrayOptionsReply.includes(optionReply)) {
        return;
      } else {
        this.arrayOptionsReply.push(optionReply)
      }
      if (this.allOptionsFromPractice[indice].option_name === 'Opción Múltiple') {
        this.countAttempts = this.countAttempts + 1;
      } else if (this.allOptionsFromPractice[indice].option_name === 'Selección Múltiple' && this.arrayOptionsReply.length === questionOptionsCorrect.length) {
        this.countAttempts = this.countAttempts + 1;
      }
    } else if (e === false) {
      if (this.arrayOptionsReply.includes(optionReply)) {
        const indice = this.arrayOptionsReply.indexOf(optionReply)
        this.arrayOptionsReply.splice(indice, 1)
      }
    }
    this.validateSelectedAnswers(indice, e, j)
  }
  /** VALIDAR RESPUESTAS DE OPCION Y SELECCIÓN MULTIPLE */
  public validateSelectedAnswers(indice, event, j) {
    const question = this.arrayItemsWithOptions[indice].filter(i => i.option_item_is_correct === true)
    question.forEach(element => {
      if (this.arrayOptionsIsCorrect.length === question.length) {
        return
      } else {
        this.arrayOptionsIsCorrect.push(this.arrayItemsWithOptions[indice].indexOf(element))
      }
    });
  //  console.log('opciones correctas', this.arrayItemsWithOptions[indice].indexOf(question[0]))
    //this.arrayOptionsIsCorrect.push(this.arrayItemsWithOptions[indice].indexOf(question[0]))
    // console.log(this.arrayOptionsIsCorrect)
    const questionMap = question.map((opt: OptionOfItem) => opt.option_item_id);
    const reply = this.arrayOptionsReply.map((opRe: OptionOfItem) => opRe.option_item_id);
    const selectFalse = this.arrayOptionsReply.filter(i => i.option_item_is_correct === false)
    selectFalse.forEach(item => {
      if (this.arrayOptionsIsfalse.includes(j)) {
        return
      } else {
        this.arrayOptionsIsfalse.push(this.arrayItemsWithOptions[indice].indexOf(item))
      }
    })
    // console.log(this.arrayOptionsIsfalse)
    questionMap.sort()
    reply.sort()
    const coinciden = questionMap.length === reply.length && questionMap.every(function (v, i) { return v === reply[i] });
    if (question.length === 0 && reply.length === 0) {
      return;
    } else if (question.length > 0 && reply.length > 0 && coinciden === true) {
      this.isCorrect = true;
      swal({
        title: 'Muy Bien',
        text: 'Tú respuesta ha sido correcta!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop);
      $('.btn-next').click();
      this.endTime = new Date().getTime() / 1000;
      this.saveActivityInQuestion()
      this.disableQuestion = true;
      this.arrayOptionsReply = []
      this.nextQuestions();

    } else if (question.length > 0 && reply.length > 0 && coinciden === false && event) {
      if (this.allOptionsFromPractice[indice].option_name === 'Selección Múltiple'
        && this.arrayOptionsReply.length === question.length) {
        swal({
          title: 'Vuelve a intentar, tu respuesta no es correcta', buttonsStyling: true, confirmButtonClass: 'btn btn-fill btn-warning',
        })
        this.numberOfError = this.numberOfError + 1
      }
      if (this.allOptionsFromPractice[indice].option_name === 'Opción Múltiple' && coinciden === false) {
        this.numberOfError = this.numberOfError + 1
        const opt = j;
        // this.arrayOptionsIsfalse.push(this.arrayItemsWithOptions[indice].indexOf(this.arrayOptionsReply[0]))
        this.arrayOptionsReply.splice(opt, 1)
        var $item = $('#item_' + indice + '_' + opt);
        $item.removeClass("cardSelect");
        swal({
          title: 'Vuelve a intentar, tu respuesta no es correcta', buttonsStyling: true, confirmButtonClass: 'btn btn-fill btn-warning',
        })
        this.arrayOptionsReply = [];
      }

      //  this.saveActivityInQuestion()
      // this.getItemsFromOption()
    }
    if (this.countAttempts.toLocaleString() === this.allOptionsFromPractice[indice].options_attemps && coinciden === false) {
      this.disableQuestion = true;
      swal({ title: 'Haz agotado todos los intentos', buttonsStyling: true, confirmButtonClass: "btn-danger", })
      // console.log('opciones en false',this.arrayOptionsIsfalse)
      this.arrayOptionsIsCorrect.forEach(i => {
        // console.log(i)
        var $item = $('#item_' + indice + '_' + i);
        // $item.removeClass("cardSelect");
        $item.addClass("cardCorrect")
      })
      this.arrayOptionsIsfalse.forEach(data => {
        // console.log('false',data)
        var $item = $('#item_' + indice + '_' + data);
        $item.removeClass("cardSelect");
        $item.addClass("cardFalse")
      })
      /*this.arrayOptionsIsfalse.forEach(false => {

      })*/
      this.endTime = new Date().getTime() / 1000;
      this.isCorrect = true;
      this.saveActivityInQuestion()
      this.arrayOptionsIsCorrect = []
      this.arrayOptionsIsfalse = []
      this.arrayOptionsReply = []
    }
  }

  /** FUNCIÓN PARA FINALIZAR WIZARD */
  public onFinishWizardQuestions() {
    $('#ModalPracticeDetail').modal('hide');
    this.cleanData()
    this.isReturnFinish.emit(true);
  }
  /** FUNCIÓN SIGUIENTE PREGUNTA */
  public nextQuestions() {
    this.startTime = new Date().getTime() / 1000;
    this.cleanData()
  }

  /** LIMPIAR VALORES DE VARIABLES */
  public cleanData() {
    this.isCorrect = false;
    this.responseArray = []
    this.arrayRes = [];
    this.countAttempts = 0;
    this.disableQuestion = false;
    this.endTime = '';
    this.time = '';
    this.infoActivityQuestion = {};
    this.numberOfError = 0;
    this.replyText = false;
    this.arrayOptionsReply = []
    this.resText = '';
    this.practiceInformation = [];
    this.questionInformation = [];
  }

  /** validar opciones de respuesta escrita */
  public validateAnswer(ind) {
    this.questionInformation = [this.allOptionsFromPractice[ind]];
    this.countAttempts = this.countAttempts + 1;
    this.optionId = this.allOptionsFromPractice[ind].option_id;
    if (this.responseArray.length !== this.arrayItemsWithOptions[ind].length) {
      swal({
        title: 'Vuelve a intentar, tu respuesta no es correcta', buttonsStyling: true, confirmButtonClass: 'btn btn-fill btn-warning',
      })
      this.numberOfError++;
      if (this.countAttempts.toLocaleString() === this.allOptionsFromPractice[ind].options_attemps && !this.isCorrect) {
        this.disableQuestion = true;
        this.isCorrect = true;
        swal({ title: 'Haz agotado todos los intentos', buttonsStyling: true, confirmButtonClass: "btn-danger", })
        this.endTime = new Date().getTime() / 1000;
        this.saveActivityInQuestion()
      }
      //  this.isCorrect = false
      return;
    } else if (this.responseArray.length === this.arrayItemsWithOptions[ind].length) {
      this.arrayItemsWithOptions[ind].forEach(questionItem => {
        questionItem.option_item_description = questionItem.option_item_description.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
        this.responseArray.forEach(resoptions => {
          resoptions = resoptions.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
          if (this.arrayRes.includes(resoptions)) {
            return;
          }
          if (questionItem.option_item_description === resoptions) {
            this.arrayRes.push(resoptions)
            if (this.arrayRes.length === this.arrayItemsWithOptions[ind].length) {
              this.isCorrect = true;
              swal({
                title: 'Muy Bien',
                text: 'Haz respondido correctamente',
                buttonsStyling: true,
                confirmButtonClass: 'btn btn-fill btn-success',
                type: 'success'
              }).catch(swal.noop);
              this.endTime = new Date().getTime() / 1000;
              this.saveActivityInQuestion()
              this.disableQuestion = true;
              $('.btn-next').click();
              this.nextQuestions();
            } else {
              swal({
                title: 'Vuelve a intentar, tu respuesta no es correcta', buttonsStyling: true, confirmButtonClass: 'btn btn-fill btn-warning',
              })
              this.isCorrect = false
            }
          }
        })
      })
    }
    if (!this.isCorrect) {
      this.numberOfError = this.numberOfError + 1;
    }
    if (this.countAttempts.toLocaleString() === this.allOptionsFromPractice[ind].options_attemps && !this.isCorrect) {
      this.disableQuestion = true;
      this.isCorrect = true;
      swal({ title: 'Haz agotado todos los intentos', buttonsStyling: true, confirmButtonClass: "btn-danger", })
      this.endTime = new Date().getTime() / 1000;
      this.saveActivityInQuestion()
    }
  }

  /** cerrar modal y retornar a componente padre */
  public closeModal() {
    $('#ModalPracticeDetail').modal('hide');
    this.isReturn.emit(true);
  }

  /** METODO PARA OBTENER DATOS DE PREGUNTA TEXTO ABIERTO */
  public onKey(e) {
    if (e.length !== 0) {
      this.resText = e;
      this.replyText = true;
    } else if (e.length === 0) {
      this.isCorrect = false;
      this.replyText = false;
    }
  }
  /**METODOS PARA GUARDAR RESPUESTA DE TEXTO */
  public validateText(i) {
    this.isCorrect = true;
    this.optionId = this.allOptionsFromPractice[i].option_id;
    this.questionInformation = [this.allOptionsFromPractice[i]];
    this.disableQuestion = true;
    this.endTime = new Date().getTime() / 1000;
    this.saveActivityInQuestion();
    swal({
      title: 'Muy Bien',
      text: 'Se ha guardado tu respuesta correctamente!',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-fill btn-success',
      type: 'success'
    }).catch(swal.noop);
    $('.btn-next').click();
    this.nextQuestions();
  }
  /** GUARDAR DATALLE DE ACCIÓN DE PREGUNTA */
  public saveActivityInQuestion() {
    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }).split(' ');
    const time = Math.abs(this.endTime - this.startTime);
    const seconds = Math.ceil(time)
    this.toHHMMSS(seconds)
    if (this.time) {
      this.infoActivityQuestion = {
        'date': init_date[0],
        'hour': this.startTime,
        'startTime': this.startTime,
        'endTime': this.endTime,
        'time': this.time,
        'numberOfattempts': this.countAttempts,
        'questionId': this.optionId,
        'practiceId': this.practiceId,
        'practiceAttemptsId': this.practiceAttemptsId,
        'numberOfErrors': this.numberOfError,
        'textReply': this.resText,
        'questionInformation': this.questionInformation
      }
      if (this.practiceInformation.length > 0) {
        this.studentSubjectService.savePracticeInformation(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum.resource_id, this.infoActivityQuestion, this.idIntent, this.practiceInformation)
      }
      this.studentSubjectService.saveInformationOfPracticeItems(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum.resource_id, this.infoActivityQuestion, this.idIntent)

    }
  }
  /** TRANSFORMAR SEGUNDOS EN FORMATO HORA */
  public toHHMMSS(sec) {
    let sec_num = parseInt(sec, 10)
    let hours = Math.floor(sec_num / 3600) % 24
    let minutes = Math.floor(sec_num / 60) % 60
    let seconds = sec_num % 60
    const time = [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
    this.time = time
  }
}
