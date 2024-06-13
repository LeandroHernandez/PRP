import {Component, Input, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {Adminpractices} from '../../../../models/class/class.documentadminpractices';
import {Rubric, RubricJudgement, RubricJudgementItem, RubricPoint} from '../../../../models/class/class.documentrubric';
import {TypePractice} from '../../../../models/class/class.documenttype-practice';
import {AdminEssayService} from '../../../../services/adminEssay/admin-essay.service';
import {StudentSubjectsService} from '../../../../services/student-subjects/student-subjects.service';
import {StorageService} from '../../../../services/storage/storage.service';

declare var $: any;

@Component({
  selector: 'app-essay-simulator',
  templateUrl: './essay-simulator.component.html',
  styleUrls: ['./essay-simulator.component.css']
})
export class EssaySimulatorComponent implements OnInit {

  @Input() essayId: String;
  public essay: Adminpractices[];
  public essayName: string;
  public essayRubric: Rubric;
  public rubricJudgements: RubricJudgement[];
  public rubricPoints: RubricPoint[];
  public studentCalificationItems: RubricJudgementItem[];
  public allOptionsFromEssay: Array<TypePractice>;
  public essayAnswer: {};
  public showRubric = false;
  total = 0;

  constructor(public adminEssayService: AdminEssayService,
              public studentSubjectsService: StudentSubjectsService,
              public storageService: StorageService) {
  }

  ngOnInit(): void {
    this.essayRubric = {};

    if (this.essayId) {
      this.viewEssay(this.essayId);
      this.getRubric();
    }
  }

  /* Información de la actividad */
  public async viewEssay(essay_id: String) {
    this.essay = await this.adminEssayService.getEssay(essay_id).pipe(take(1)).toPromise();
    this.essayName = this.essay.map((p) => p.essay_name).toLocaleString()
    this.getOptionsFromEssay(this.essay);
  }

  public async getOptionsFromEssay(essay: Adminpractices[]) {
    this.essayId = essay.map((p) => p.essay_id).toLocaleString();
    this.allOptionsFromEssay = await this.adminEssayService.getOptionsFromEssay(this.essayId).pipe(take(1)).toPromise();
  }

  /* Obtiene rubricas */
  public async getRubric() {
    this.adminEssayService.getRubric(this.essayId).subscribe(resp => {
      this.essayRubric = new Rubric(resp[0]);
      this.getRubricPoints(this.essayId, this.essayRubric);
    })
  }

  private getRubricPoints(essay, rubric) {
    this.adminEssayService.getRubricPoints(essay, rubric).subscribe((resp: RubricPoint[]) => {
      this.rubricPoints = resp;
      this.getRubricJudgements(this.essayId, this.essayRubric, this.studentCalificationItems);
    })
  }

  private getRubricJudgements(essay, rubric, studentScoreList?: any) {
    this.adminEssayService.getRubricJudgements(essay, rubric).subscribe((resp: RubricJudgement[]) => {
      this.rubricJudgements = resp;
      this.rubricJudgements.forEach(r => {
        this.adminEssayService.getRubricJudgementItems(essay, rubric, r).subscribe((items: RubricJudgementItem[]) => {
          studentScoreList.forEach(score => {
            items.some((it: any) => {
              if (it.rubric_judgement_item_id === score.rubric_judgement_item_id) {
                it.selected = true;
                this.total += it.rubric_judgement_item_calification;
              }
            })
          })
          r.rubric_judgement_items = items;
        });
      })
    })
  }
  /* !Obtiene rubricas */

}
