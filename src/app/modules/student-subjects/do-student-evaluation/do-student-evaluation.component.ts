import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { Evaluation } from 'app/models/class/class.resource';

/** Service */
import { AdminEvaluationService } from 'app/services/adminEvaluation/admin-evaluation.service'

/** MODELS */
import { Adminpractices } from 'app/models/class/class.documentadminpractices';
import { TypePractice, OptionOfItem } from 'app/models/class/class.documenttype-practice';
import { Student } from 'app/models/student/student.model';
import { Subject } from 'app/models/class/classdocumentSubject';
import { InformationEvaluationQuestion } from 'app/models/class/class.document-informationPracticeQuestion';
import { EvaluationSummary } from 'app/models/class/evaluation-summary';
import { take } from 'rxjs/operators';
import swal from 'sweetalert2';
import { TeacherSubjectsService } from 'app/services/teacher-subjects/teacher-subjects.service';

declare var $: any;
@Component({
  selector: 'app-do-student-evaluation',
  templateUrl: './do-student-evaluation.component.html',
  styleUrls: ['./do-student-evaluation.component.css']
})
export class DoStudentEvaluationComponent implements OnInit {

  @Input() evaluationId: String;
  @Input() student: Student;
  @Input() subject: Subject;
  @Input() evaluationIDCreation: string;
  @Input() activeUnit: any;
  @Input() classSelected: any;
  @Output() isReturn = new EventEmitter();
  public evaluation: Adminpractices[];
  public questionsFromEvaluation: Array<TypePractice>;
  public optionsFromQuestion: Array<Object> = [];
  public arrayItemsWithQuestion: any[];
  public arrayOptionsReply: any[] = [];
  public isCorrect = false;
  public responseArray = [];
  public arrayRes = []
  public arrayQuestionTime = [];
  public informationQuestion: InformationEvaluationQuestion;
  public questionOptions: OptionOfItem;
  public numberFromCorrect = 0;
  public numberFromError = 0;
  public startTime: any;
  public startTimeEvaluation: any;
  public endTimeEvaluation: any;
  public question: TypePractice;
  public score: number;
  public seconds: number;
  public interval: any;
  public timerInQuestion = 0;
  public secondsInQuestion: number;
  public questionIndex: number;
  public totalScore = 0;
  public totalTime: any = 0;
  public totalInformationEvaluation: EvaluationSummary;
  public overTime = false;
  public scoreFromQuestion: number;
  public count_second: any;
  public count_minutes: any;
  public timeTotalisOver: boolean;
  // public save = false;
  public idEvaluationAttempt: any;
  public isDisabled = false;
  constructor(private evaluationService: AdminEvaluationService) { }

  ngOnInit(): void {
    if (this.evaluationId) {
      this.getEvaluation()

    }
    this.idEvaluationAttempt = this.evaluationIDCreation;


  }
  public async getEvaluation() {
    this.evaluation = await this.evaluationService.getEvaluation(this.evaluationId).pipe(take(1)).toPromise();
    this.getQuestionsFromEvaluation()
  }

  public async getQuestionsFromEvaluation() {
    this.questionsFromEvaluation = await this.evaluationService.getOptionsFromEvaluations(this.evaluationId).pipe(take(1)).toPromise();
    this.questionsFromEvaluation.sort(() => Math.random() - 0.5);
    this.getOptionsFromQuestion();
  }
  public async getOptionsFromQuestion() {
    this.arrayQuestionTime = []
    this.arrayItemsWithQuestion = [];
    this.arrayOptionsReply = [];
    this.responseArray = []
    this.questionsFromEvaluation.forEach(async question => {
      if (question.question_time !== 'Otro') {
        this.arrayQuestionTime.push(question.question_time)
      } else {
        this.arrayQuestionTime.push(question.other_question_time)
      }
      this.optionsFromQuestion = await this.evaluationService.getAllOptionsFromOption(this.evaluationId, question).pipe(take(1)).toPromise();
      this.optionsFromQuestion.sort(() => Math.random() - 0.5);
      this.arrayItemsWithQuestion.push(this.optionsFromQuestion)
    })
    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }).split(' ');
    this.startTimeEvaluation = init_date[1];
    // console.log(this.arrayQuestionTime)
    if (this.arrayQuestionTime[0] !== 'Sin limite') {
      this.seconds = this.arrayQuestionTime[0];
      this.startTimer()
    }
    this.questionIndex = 0;
    this.totalInformationEvaluation = {
      'date': init_date[0],
      'evaluationData': this.evaluation,
      'startTime': this.startTimeEvaluation,
      'evaluationStatus': false,
      'evaluationId': this.idEvaluationAttempt
    }
    this.evaluationService.saveEvaluationInformation(this.student.student_id, this.subject, this.activeUnit.unit_id,
      this.classSelected.class_id, this.totalInformationEvaluation, false)
    $('.carousel').carousel({
      interval: false,
      wrap: false,
      keyboard: true,
    });
  }

  /** SE INICIALIZA EL TEMPORIZADOR */
  startTimer() {
    if (parseInt(this.seconds.toString()) > 60) {
      this.count_minutes = Math.floor(parseInt(this.seconds.toString()) / 60) % 60
      this.count_second = parseInt(this.seconds.toString()) % 60
      if (this.count_second === 0) {
        this.count_minutes--;
        this.count_second = 60;
      }
      this.interval = setInterval(() => {
        this.count_second--;
        if (this.count_minutes === 0 && this.count_second === 0) {
          this.count_minutes = 0;
          this.timeTotalisOver = true;
        }
        if (this.count_second === 0) {
          this.count_minutes--;
          this.count_second = 60;
        }
        this.timerInQuestion = parseInt(this.timerInQuestion.toString()) + 1;
        if (this.timeTotalisOver && this.arrayOptionsReply.length !== 0) {
          //  console.log('segundos es igual a 0')
          clearInterval(this.interval);
          if (this.arrayQuestionTime[this.questionIndex] === 'Sin limite') {
            this.secondsInQuestion = 0;
          } else {
            this.secondsInQuestion = this.timerInQuestion;
          }
          this.timerInQuestion = 0;
          this.seconds = this.arrayQuestionTime[this.questionIndex + 1];
          setTimeout(() => swal({
            allowEscapeKey: false, allowOutsideClick: false, title: 'Se agoto el tiempo de la pregunta!'
          }).then((result) => {
            if (result.value) {
              this.saveInformationFromQuestion()
            }
          }))
        } else if (this.timeTotalisOver && this.arrayOptionsReply.length === 0) {
          clearInterval(this.interval);
          this.questionOptions = this.arrayItemsWithQuestion[this.questionIndex];
          this.question = this.questionsFromEvaluation[this.questionIndex];
          if (this.arrayQuestionTime[this.questionIndex] === 'Sin limite') {
            this.secondsInQuestion = 0;
          } else {
            this.secondsInQuestion = this.arrayQuestionTime[this.questionIndex];
          }
          this.seconds = this.arrayQuestionTime[this.questionIndex + 1];
          this.score = 0;
          swal({
            allowEscapeKey: false, allowOutsideClick: false, title: 'Se agoto el tiempo de la pregunta!'
          }).then((result) => {
            if (result.value) {
              setTimeout(() => { this.saveInformationFromQuestion() }, 1000);
            }
          })
        }
      }, 1000)
    } else if (parseInt(this.seconds.toString()) <= 60) {
      this.count_second = parseInt(this.seconds.toString()) % 60
      this.interval = setInterval(() => {
        this.count_second--;
        this.timerInQuestion = parseInt(this.timerInQuestion.toString()) + 1;
        if (this.count_second === 0 && this.arrayOptionsReply.length !== 0) {
          //  console.log('segundos es igual a 0')
          clearInterval(this.interval);
          if (this.arrayQuestionTime[this.questionIndex] === 'Sin limite') {
            this.secondsInQuestion = 0;
          } else {
            this.secondsInQuestion = this.timerInQuestion;
          }
          this.timerInQuestion = 0;
          this.seconds = this.arrayQuestionTime[this.questionIndex + 1];
          setTimeout(() => swal({
            allowEscapeKey: false, allowOutsideClick: false, title: 'Se agoto el tiempo de la pregunta!'
          }).then((result) => {
            if (result.value) {
              this.saveInformationFromQuestion()
            }
          }))
        } else if (this.count_second === 0 && this.arrayOptionsReply.length === 0) {
          clearInterval(this.interval);
          this.questionOptions = this.arrayItemsWithQuestion[this.questionIndex];
          this.question = this.questionsFromEvaluation[this.questionIndex];
          if (this.arrayQuestionTime[this.questionIndex] === 'Sin limite') {
            this.secondsInQuestion = 0;
          } else {
            this.secondsInQuestion = this.arrayQuestionTime[this.questionIndex];
          }
          this.seconds = this.arrayQuestionTime[this.questionIndex + 1];
          this.score = 0;
          swal({
            allowEscapeKey: false, allowOutsideClick: false, title: 'Se agoto el tiempo de la pregunta!'
          }).then((result) => {
            if (result.value) {
              this.saveInformationFromQuestion()
            }
          })
        }
      }, 1000)
    }

  }
  /** DETECTAR SELECCIÓN DE SELECCIÓN Y OPCIÓN MULTIPLE */
  public onChangeReply(e, optionReply, indice, j) {
    const $option = $('#option_' + indice + '_' + j);
    const question = this.arrayItemsWithQuestion[indice].filter(i => i.option_item_is_correct === true)
    if (e === true && this.arrayOptionsReply.length <= question.length) {
      $option.addClass('cardSelect')
      if (this.arrayOptionsReply.includes(optionReply)) {
        return;
      } else {
        this.arrayOptionsReply.push(optionReply)
      }
    }
    if (e === false) {
      $option.removeClass('cardSelect');
      if (this.arrayOptionsReply.includes(optionReply)) {
        const indice = this.arrayOptionsReply.indexOf(optionReply)
        this.arrayOptionsReply.splice(indice, 1)
      }
    }
    this.validateSelectedAnswers(indice)

  }

  /** VALIDAR RESPUESTAS DE OPCIONES Y SELECCIÓN MULTIPLE */
  public validateSelectedAnswers(indice) {
    //  console.log('indice en opción y selección multiple',indice)
    this.questionIndex = indice;
    this.questionOptions = this.arrayItemsWithQuestion[indice];
    this.question = this.questionsFromEvaluation[indice];
    const question = this.arrayItemsWithQuestion[indice].filter(i => i.option_item_is_correct === true)
    const questionMap = question.map((opt: OptionOfItem) => opt.option_item_id);
    const reply = this.arrayOptionsReply.map((opRe: OptionOfItem) => opRe.option_item_id)
    /** SE ASIGNA LA INFORMACIÓN CORRESPENDIENTE PARA GUARDAR REGISTRO */
    const questionMapScore = question.map((opt: OptionOfItem) => opt.option_scoring.valueOf());
    this.numberFromCorrect = this.arrayOptionsReply.filter(option => option.option_item_is_correct === true).length;
    this.numberFromError = this.arrayOptionsReply.filter(option => option.option_item_is_correct === false).length;
    this.score = questionMapScore[0] * this.numberFromCorrect;
    questionMap.sort()
    reply.sort()
    const coinciden = questionMap.length === reply.length && questionMap.every(function (v, i) { return v === reply[i] });
    if (question.length === 0 && reply.length === 0) {
      return;
    } else if (question.length > 0 && reply.length > 0 && coinciden === true) {
      this.isCorrect = true;
      /** SE DETIENE EL TEMPORIZADOR  */
    }
    if (this.arrayOptionsReply.length === question.length) {
      clearInterval(this.interval);
      if (this.arrayQuestionTime[indice] === 'Sin limite') {
        this.secondsInQuestion = 0;
      } else {
        this.secondsInQuestion = this.timerInQuestion;
      }
      this.seconds = this.arrayQuestionTime[indice + 1];
      this.timerInQuestion = 0;
      this.saveInformationFromQuestion()
    }
  }

  /** validar opciones de respuesta escrita */
  public validateAnswer(ind, j) {
    // console.log('indice respuesta escrita', ind)
    this.questionIndex = ind;
    this.questionOptions = this.arrayItemsWithQuestion[ind];
    this.question = this.questionsFromEvaluation[ind];
    if (this.arrayRes[j]) {
      this.numberFromCorrect = this.numberFromCorrect - 1;
      this.numberFromError++;
      this.arrayRes.splice(j, 1)
      this.score = this.scoreFromQuestion * this.numberFromCorrect;
    }
    this.arrayItemsWithQuestion[ind].forEach(questionItem => {
      this.scoreFromQuestion = questionItem.option_scoring;
      questionItem.option_item_description = questionItem.option_item_description.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
      this.arrayOptionsReply = this.responseArray
      this.responseArray.forEach(resoptions => {
        resoptions = resoptions.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        if (this.arrayRes.includes(resoptions)) {
          return;
        } else {
          if (resoptions === questionItem.option_item_description) {
            this.arrayRes.push(resoptions)
            this.numberFromCorrect++;
            this.score = this.scoreFromQuestion * this.numberFromCorrect;
          }
          this.numberFromError = this.arrayItemsWithQuestion[ind].length - this.numberFromCorrect
          // console.log('agregados',this.arrayRes )
          if (this.arrayRes.length === this.arrayItemsWithQuestion[ind].length) {
            this.isCorrect = true;
          }

        }
      })
    })
  }

  /** ALMACENAR INFORMACIÓN DE PREGUNTA  */
  public saveInformationFromQuestion() {
    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }).split(' ');
    this.informationQuestion = {
      'date': init_date[0],
      'questionOptions': this.questionOptions,
      'answers': this.arrayOptionsReply,
      'evaluationId': this.idEvaluationAttempt,
      'numberOfCorrect': this.numberFromCorrect,
      'numberOfErrors': this.numberFromError,
      'question': this.question,
      'score': this.score,
      'time': this.secondsInQuestion,
      'questionId': this.question.option_id
    }
    this.evaluationService.saveInformationQuestionFromStudent(this.student.student_id,
      this.subject.subject_id, this.activeUnit.unit_id, this.classSelected.class_id, this.informationQuestion)
    // console.log('information question', this.informationQuestion);
    this.totalScore = parseFloat(this.totalScore.toString()) + parseFloat(this.score.toString());
    // this.totalTime = parseInt(this.totalTime.toString()) + parseInt(this.secondsInQuestion.toString());
    if (this.questionIndex + 1 === this.questionsFromEvaluation.length) {
      this.seconds = 0;
      const timeTotal = Math.abs(new Date().getTime() - this.idEvaluationAttempt);
      this.totalTime = Math.ceil(timeTotal / 1000);
      this.toHHMMSS(this.totalTime)
      this.saveSummaryEvaluation()
    }
    this.questionIndex = this.questionIndex + 1;

    this.numberFromCorrect = 0;
    this.numberFromError = 0;
    this.arrayOptionsReply = [];
    this.isCorrect = false;
    this.responseArray = [];
    this.arrayRes = [];
    this.timerInQuestion = 0;
    this.score = 0;
    this.scoreFromQuestion = 0;
    this.timeTotalisOver = false;
    this.isDisabled = false;
    $('.carousel').carousel(this.questionIndex);
    // console.log('indice siguiente pregunta ',this.questionIndex)
    if (this.arrayQuestionTime[this.questionIndex] !== 'Sin limite' && this.questionIndex !== this.questionsFromEvaluation.length) {
      setTimeout(() => { this.startTimer() }, 1000);
    }
  }
  /* ALMACENAR INFORMACIÓN DE RESUMEN DE EVALUACIÓN*/
  public saveSummaryEvaluation() {
    const total = this.totalScore.toFixed(1);
    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }).split(' ');
    this.totalInformationEvaluation = {
      'date': init_date[0],
      'evaluationData': this.evaluation,
      'endTime': init_date[1],
      'startTime': this.startTimeEvaluation,
      'totalScore': this.totalScore,
      'totalTime': this.totalTime,
      'evaluationId': this.idEvaluationAttempt,
      'evaluationStatus': true,
    }
    console.log(this.totalInformationEvaluation)

    this.evaluationService.saveEvaluationInformation(this.student.student_id, this.subject, this.activeUnit.unit_id,
      this.classSelected.class_id, this.totalInformationEvaluation, true)
    // console.log('total information evaluation', this.totalInformationEvaluation);
    swal({
      title: 'Haz finalizado la evaluación!',
      text: 'La puntuación obtenida es de:  ' + total,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonColor: 'rgb(135,203,22)',
    }).then((result) => {
      if (result.value) {
        this.isReturn.emit(true);
      }
    })
  }
  /** TRANSFORMAR TOTAL DE SEGUNDOS A FORMATO HORA */
  public toHHMMSS(sec) {
    const sec_num = parseInt(sec, 10)
    const hours = Math.floor(sec_num / 3600) % 24
    const minutes = Math.floor(sec_num / 60) % 60
    const seconds = sec_num % 60
    const time = [hours, minutes, seconds].map(v => v < 10 ? '0' + v : v).filter((v, i) => v !== '00' || i > 0).join(':');
    this.totalTime = time
  }
  public click() {
    setTimeout(() => { this.saveAnswer() }, 1000);

  }
  public saveAnswer() {
    clearInterval(this.interval);
    if (this.arrayOptionsReply.length === 0) {
      this.questionOptions = this.arrayItemsWithQuestion[this.questionIndex];
      this.question = this.questionsFromEvaluation[this.questionIndex];
      this.secondsInQuestion = 0;
      this.score = 0;
    }
    if (this.arrayQuestionTime[this.questionIndex] === 'Sin limite') {
      this.secondsInQuestion = 0;
    } else {
      this.secondsInQuestion = this.timerInQuestion;
    }
    this.saveInformationFromQuestion()
  }

}
