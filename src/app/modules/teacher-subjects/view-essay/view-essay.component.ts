import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rubric, RubricJudgement, RubricJudgementItem, RubricPoint} from '../../../models/class/class.documentrubric';
import {AdminEssayService} from '../../../services/adminEssay/admin-essay.service';
import {Student} from '../../../models/student/student.model';
import swal from 'sweetalert2';
import {take} from 'rxjs/operators';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {TypePractice} from '../../../models/class/class.documenttype-practice';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AnswerStudentDTO} from '../../../models/dto/qualification/AnswerStudentDTO';

declare var $;

@Component({
  selector: 'app-view-essay',
  templateUrl: './view-essay.component.html',
  styleUrls: ['./view-essay.component.css']
})
export class ViewEssayComponent implements OnInit {

  @Input() essayId: any;
  @Input() subjectId: string;
  @Input() unitId: string;
  @Input() classId: string;
  @Input() student: Student;
  @Output() isReturn = new EventEmitter();

  public essayAnswer: AnswerStudentDTO = new AnswerStudentDTO();
  public essay: Adminpractices[];
  public essayName: string;
  public description: string;
  public resourceUrl;
  public essayRubric: Rubric;
  public allOptionsFromEssay: Array<TypePractice>;
  public rubricJudgements: RubricJudgement[];
  public rubricPoints: RubricPoint[];
  public studentCalificationItems: RubricJudgementItem[];
  public isSave = false;
  public hasRubric: boolean;
  public resourcesUrl = [];

  constructor(public adminEssayService: AdminEssayService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    $('#ModalEssayDetail').modal('show');
    this.getStudentAnswer();
    this.getRubric();
    this.viewEssay(this.essayId.resource_id).then(() => '');
  }

  /* Información de la actividad */
  public async viewEssay(essay_id: String) {
    this.essay = await this.adminEssayService.getEssay(essay_id).pipe(take(1)).toPromise();
    this.essayName = this.essay.map((p) => p.essay_name).toLocaleString();
    this.getOptionsFromEssay(essay_id).then(() => '');
  }

  private async getOptionsFromEssay(essay: String) {
    this.allOptionsFromEssay = await this.adminEssayService.getOptionsFromEssay(essay).pipe(take(1)).toPromise();
    this.allOptionsFromEssay.forEach(item => {
      this.description = item.option_description;
    })
  }

  /* !Información de la actividad */

  public getStudentAnswer() {
    const studentAnswer = this.adminEssayService
        .getStudentAnswerV2(this.student.student_id, this.subjectId, this.unitId, this.classId, this.essayId.resource_id);
    studentAnswer.then(answer => {
      if (answer.exists) {
        this.essayAnswer = answer.data() as AnswerStudentDTO;
        if (this.essayAnswer.hasOwnProperty('resource_url')) {
          const auxURLS = this.essayAnswer['resource_url'];
          auxURLS.forEach( url => {
            this.resourcesUrl.push(this.sanitizerUrl(url))
          })
        }
        /*if (this.essayAnswer.hasOwnProperty('resource_url')) {
          this.resourceUrl = this.sanitizerUrl(this.essayAnswer.resource_url);
        }*/
      } else {
        this.essayAnswer = new AnswerStudentDTO();
        this.resourceUrl = this.sanitizerUrl('');
      }
    })
  }

  private async getStudentCalification() {
    return this.adminEssayService
        .getStudentCalifications(this.student.student_id, this.subjectId, this.unitId, this.classId, this.essayId.resource_id)
        .pipe(take(1))
        .toPromise();
  }

  public getRubric() {
    if (this.essayId.resource_id_original) {
      this.adminEssayService.getRubric(this.essayId.resource_id_original).subscribe(resp => {
        if (resp.length > 0) {
          this.hasRubric = true;
          this.essayRubric = new Rubric(resp[0]);
          this.getRubricPoints(this.essayId.resource_id_original, this.essayRubric);
          this.getStudentCalification().then((items: RubricJudgementItem[]) => {
            if (items.length > 0) {
              this.studentCalificationItems = items;
              this.isSave = true;
            } else {
              this.studentCalificationItems = [];
              this.isSave = false
            }
            this.getRubricJudgements(this.essayId.resource_id_original, this.essayRubric, this.studentCalificationItems);
          })
        } else {
          this.hasRubric = false
        }
      })
    }

  }

  private getRubricPoints(essay, rubric) {
    this.adminEssayService.getRubricPoints(essay, rubric).subscribe((resp: RubricPoint[]) => {
      this.rubricPoints = resp;
    })
  }

  private getRubricJudgements(essay, rubric, studentScoreList?: any) {
    this.adminEssayService.getRubricJudgements(essay, rubric).subscribe((resp: RubricJudgement[]) => {
      this.rubricJudgements = resp;
      this.rubricJudgements.forEach(r => {
        this.adminEssayService.getRubricJudgementItems(essay, rubric, r)
            .subscribe((items: RubricJudgementItem[]) => {
              studentScoreList.forEach(score => {
            items.some((it: any) => {
              if (it.rubric_judgement_item_id === score.rubric_judgement_item_id) {
                it.selected = true;
              }
            })
          })
          r.rubric_judgement_items = items;
        });
      })
    })
  }

  setSelected(item: RubricJudgementItem, rubric_judgement_items: RubricJudgementItem[]) {
    console.log(rubric_judgement_items);
    rubric_judgement_items.map(l => {
      l.selected = l.rubric_judgement_item_id === item.rubric_judgement_item_id;
    });
  }

  async saveComment() {
    await this.adminEssayService
        .saveComment(this.student.student_id, this.subjectId, this.unitId, this.classId,
            this.essayId.resource_id, this.essayAnswer.resource_comment)
        .then(() => {
          swal({
            title: 'Ok',
            text: 'Comentario agregado',
            type: 'success',
            showConfirmButton: true,
            showCancelButton: false
          }).then(() => {
            this.closeModal();
          });
        })
  }

  async saveQualification(isNew) {
    this.isSave = !isNew;
    this.adminEssayService
        .saveStudentQualification(this.student.student_id, this.subjectId, this.unitId,
            this.classId, this.essayId.resource_id, this.rubricJudgements, isNew);
  }

  /** cerrar modal y retornar a componente padre */
  public closeModal() {
    $('#ModalEssayDetail').modal('hide');
    this.isReturn.emit(true);
  }

  /**
   * Omite la seguridad y confía en que el valor dado sea un URL
   * @param url direccion del recurso externo
   */
  sanitizerUrl(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadAdj(resource_url: any) {
    this.resourceUrl = resource_url;
  }


  itemIsEnabled(item: RubricJudgementItem, rubric_judgement_items: RubricJudgementItem[]): boolean {
    return !!rubric_judgement_items
        .find(value => value.rubric_judgement_item_id === item.rubric_judgement_item_id && value.selected === true);
  }
}
