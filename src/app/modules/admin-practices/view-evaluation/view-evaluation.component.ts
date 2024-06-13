import { Component, OnInit, EventEmitter, Output, Input, SimpleChange } from '@angular/core';
import { AdminEvaluationService } from 'app/services/adminEvaluation/admin-evaluation.service';
/** MODELS */
import { Adminpractices } from 'app/models/class/class.documentadminpractices';
import { TypePractice, OptionOfItem } from 'app/models/class/class.documenttype-practice';
import { take } from 'rxjs/operators';
import swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-view-evaluation',
  templateUrl: './view-evaluation.component.html',
  styleUrls: ['./view-evaluation.component.css']
})
export class ViewEvaluationComponent implements OnInit {
  @Input() evaluationId: String;
  @Input() showViewEvaluation: Boolean;
  @Output() isReturn = new EventEmitter();

  public evaluation: Adminpractices[];
  public evaluationName: String;
  public allOptionsFromPractice: Array<TypePractice>;
  public allOptionsFromOption: Array<Object> = [];
  public arrayItemsWithOptions: any[];
  public arrayOptionsReply: Array<Object> = [];
  public isCorrect = false;
  public responseArray = [];
  public resText = ''
  public count = 0;
  public arrayRes = []
  constructor(private evaluationService: AdminEvaluationService) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: { [evaluationId: string]: SimpleChange }) {

    if (this.evaluationId) {
      this.view_practice_questions(this.evaluationId)
    }
    this.count = this.count + 1;


  }
  public async view_practice_questions(evaluationId: String) {
    this.evaluation = await this.evaluationService.getEvaluation(evaluationId).pipe(take(1)).toPromise()
    this.evaluationName = this.evaluation.map((p) => p.practice_name).toLocaleString()
    this.getOptionsFromPractice(this.evaluation);
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
        swal("Buen Trabajo!", "Haz culminado la evaluación con éxito!", "success");

      }
    });
  }
  /** OBTIENE LISTADO DE OPCIONES POR PREGUNTA */
  public async getOptionsFromPractice(evaluation: Adminpractices[]) {
    this.evaluationId = evaluation.map((e) => e.evaluation_id).toLocaleString();
    this.allOptionsFromPractice = await this.evaluationService.getOptionsFromEvaluations(this.evaluationId).pipe(take(1)).toPromise()
    this.getItemsFromOption();

  }
  /** OBTIENE LISTADO DE ITEMS POR PREGUNTA */
  public getItemsFromOption() {
    let i = 0;
    this.arrayItemsWithOptions = [];
    this.allOptionsFromPractice.forEach(async option => {
      this.allOptionsFromOption = await this.evaluationService.getAllOptionsFromOption(this.evaluationId, option)
        .pipe(take(1)).toPromise();
      i = i + 1
      this.initWizard()
      this.arrayItemsWithOptions.push(this.allOptionsFromOption);
      this.isCorrect = false;
    })
  }
    /** DETECTAR CAMBIO DE OPCIÓN RESPUESTA */
    public onChangeReply(e, optionReply, indice, j) {
      var $item= $('#item_'+ indice + '_' +j);
      if (e === true) {
        $item.addClass("cardSelect")
        if (this.arrayOptionsReply.includes(optionReply)) {
          return;
        } else {
          this.arrayOptionsReply.push(optionReply)
        }
      } if (e === false) {
        $item.removeClass("cardSelect");
        if (this.arrayOptionsReply.includes(optionReply)) {
          const indice = this.arrayOptionsReply.indexOf(optionReply)
          this.arrayOptionsReply.splice(indice, 1)
        }
      }
      this.validateSelectedAnswers(indice)
    }
    /** VALIDAR RESPUESTAS DE OPCIONES Y SELECCIÓN MULTIPLE */
    public validateSelectedAnswers(indice) {
      const question = this.arrayItemsWithOptions[indice].filter(i => i.option_item_is_correct === true)
      const questionMap = question.map((opt: OptionOfItem) => opt.option_item_id);
      const reply = this.arrayOptionsReply.map((opRe: OptionOfItem) => opRe.option_item_id)
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
        this.arrayOptionsReply = []
      }
    }
  
    /** FUNCIÓN PARA FINALIZAR WIZARD */
    public onFinishWizardQuestions() {
      $('#ModalPracticeDetail').modal('hide');
      this.isReturn.emit(true);
    }
    /** FUNCIÓN SIGUIENTE PREGUNTA */
    public nextQuestions() {
      this.isCorrect = false;
      this.responseArray = []
      this.arrayRes = [];
    }
  
    /** validar opciones de respuesta escrita */
    public validateAnswer(ind) {
      if (this.responseArray.length !== this.arrayItemsWithOptions[ind].length) {
        swal({
          title: 'Vuelve a intentarlo',
          text: 'Completa todos los campos',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-danger',
          type: 'warning'
        }).catch(swal.noop);
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
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-fill btn-success',
                  type: 'success'
                }).catch(swal.noop);
              } else {
                swal({
                  title: 'Vuelve a intentarlo',
                  text: 'No haz respondido correctamente',
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-fill btn-danger',
                  type: 'warning'
                }).catch(swal.noop);
              }
            }
          })
        })
      }
    }
  
    /** cerrar modal y retornar a componente padre */
    public closeModal() {
      this.isReturn.emit(true);
    }
  
    public onKey(e) {
      this.resText = e;
      if (e.length !== 0) {
        this.isCorrect = true;
      } else if (e.length === 0) {
        this.isCorrect = false;
      }
    }

}
