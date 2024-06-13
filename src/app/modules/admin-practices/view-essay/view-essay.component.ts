import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {take} from 'rxjs/operators';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {AdminEssayService} from '../../../services/adminEssay/admin-essay.service';
import {TypePractice} from '../../../models/class/class.documenttype-practice';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-view-essay',
  templateUrl: './view-essay.component.html',
  styleUrls: ['./view-essay.component.css']
})
export class ViewEssayComponent implements OnInit, OnChanges {

  @Input() essayId: String;
  @Input() showViewEssay: Boolean;
  @Output() isReturn = new EventEmitter();

  public essay: Adminpractices[];
  public essayName: string;
  public allOptionsFromEssay: Array<TypePractice>;
  public count = 0;
  public isCorrect = false;
  public resText = '';

  constructor(public adminEssayService: AdminEssayService) { }

  ngOnInit(): void {
    if (this.essayId) {
      this.viewEssay(this.essayId)
    }
  }

  ngOnChanges(changes: { [practiceId: string]: SimpleChange }) {

    if (this.essayId) {
      this.viewEssay(this.essayId)
    }
    this.count = this.count + 1;


  }

  /** INICIALIZA EL WIZARD */
  private initWizard() {
    $('#wizardCard' + this.count).bootstrapWizard({
      tabClass: 'nav nav-pills',
      nextSelector: '.btn-next',
      lastSelector: '.btn-finish',
      onInit: function (tab, navigation, index) {
        // check number of tabs and fill the entire row
        let $total = navigation.find('li').length;
        let $width = 100 / $total;
        let $display_width = $(document).width();
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
        let $total = navigation.find('li').length;
        let $current = index + 1;
        let wizard = navigation.closest('.card-wizard');
        if ($current >= $total) {
          $(wizard).find('.btn-next').hide();
          $(wizard).find('.btn-finish').show();
        } else {
          $(wizard).find('.btn-next').show();
          $(wizard).find('.btn-finish').hide();
        }
      },
      onLast: function (tab, navigation, index) {
        swal('Buen Trabajo!', 'Haz culminado la práctica con éxito!', 'success');

      }
    });
  }

  public async viewEssay(essay_id: String) {
    this.essay = await this.adminEssayService.getEssay(essay_id).pipe(take(1)).toPromise();
    this.essayName = this.essay.map((p) => p.essay_name).toLocaleString()
    this.getOptionsFromEssay(this.essay);
  }

  public async getOptionsFromEssay(essay: Adminpractices[]) {
    this.essayId = essay.map((p) => p.essay_id).toLocaleString();
    this.allOptionsFromEssay = await this.adminEssayService.getOptionsFromEssay(this.essayId).pipe(take(1)).toPromise();
    console.log(this.allOptionsFromEssay);
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
