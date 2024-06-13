import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Menudto } from '../../../models/dto/class.menudto';
// import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';

/** SERVICE */
import { AdminPracticeService } from '../../../services/adminPractice/admin-practice.service';

/** MODELS */
import { TypePractice, OptionOfItem } from '../../../models/class/class.documenttype-practice';
import { Adminpractices } from '../../../models/class/class.documentadminpractices';
import { take } from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-practic-list',
  templateUrl: './practic-list.component.html',
  styleUrls: ['./practic-list.component.css']
})
export class PracticListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('liOptions') liOptions: Navigator;


  private _all_practice_list = new Array<Adminpractices>();
  public tablaMenu;
  public codePractice: String = '';
  public type: FormGroup;
  public practice: Adminpractices[];
  public practiceName: String;
  public practiceId: String;
  public allOptionsFromPractice: Array<TypePractice>;
  public allOptionsFromOption: Array<Object> = [];
  public arrayItemsWithOptions: any[];
  public arrayOptionsReply: Array<Object> = [];
  public isCorrect = false;
  public wizard;
  public a = 0;
  isLinear = true;
  firstFormGroup: boolean;
  secondFormGroup: FormGroup;
  constructor(
    private adminPracticeService: AdminPracticeService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.tablaMenu = $('#datatables').DataTable({})
    this.get_data_menu()
    this.firstFormGroup = false;
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  public get all_practice_list() {
    return this._all_practice_list;
  }
  public set all_practice_list(value) {
    this._all_practice_list = value;
  }

  private get_data_menu() {
    this.adminPracticeService.getAllPractice().subscribe(
      all_practice_list => {
        this.all_practice_list = all_practice_list
        this.initDataTable()
      },
      () => {
        this.all_practice_list = [];
      }
    )
  }

  public async view_practice_questions(practice_id: String) {
    this.practice = await this.adminPracticeService.getPractice(practice_id).pipe(take(1)).toPromise()
    this.practiceName = this.practice.map((p) => p.practice_name).toLocaleString()
    this.getOptionsFromPractice(this.practice)

  }

  public async getOptionsFromPractice(practice: Adminpractices[]) {
    this.practiceId = practice.map((p) => p.practice_id).toLocaleString();
    this.allOptionsFromPractice = await this.adminPracticeService.getOptionsFromPractice(this.practiceId).pipe(take(1)).toPromise()
    this.getItemsFromOption();

  }
  public getItemsFromOption() {
    let i = 0;
    this.arrayItemsWithOptions = [];
    this.allOptionsFromPractice.forEach(async option => {
      this.allOptionsFromOption = await this.adminPracticeService.getAllOptionsFromOption(this.practiceId, option)
        .pipe(take(1)).toPromise();
      i = i + 1
      this.arrayItemsWithOptions.push(this.allOptionsFromOption);
      console.log(i + ' == ' + this.allOptionsFromPractice.length);
      if (i == this.allOptionsFromPractice.length) {
        this.initWizard();
      }
      this.isCorrect = false;
    })

  }

  public onChangeReply(e, optionReply, indice) {
    if (e === true) {
      if (this.arrayOptionsReply.includes(optionReply)) {
        return;
      } else {
        this.arrayOptionsReply.push(optionReply)
      }
    } if (e === false) {
      if (this.arrayOptionsReply.includes(optionReply)) {
        const indice = this.arrayOptionsReply.indexOf(optionReply)
        this.arrayOptionsReply.splice(indice, 1)
      }
    }
    this.validateSelectedAnswers(indice)
  }
  public validateSelectedAnswers(indice) {
    const question = this.arrayItemsWithOptions[indice].filter(i => i.option_item_is_correct === true)
    const questionMap = question.map((opt: OptionOfItem) => opt.option_item_id);
    const reply = this.arrayOptionsReply.map((opRe: OptionOfItem) => opRe.option_item_id)
    questionMap.sort()
    reply.sort()
    const coinciden = questionMap.length === reply.length && questionMap.every(function (v, i) { return v === reply[i] });
    if (coinciden === true) {
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

  public nextQuestions() {
    this.isCorrect = false
  }

  public onFinishWizardQuestions() {
    $('#ModalPracticeDetail').modal('hide');
    // this.initWizard()
  }

  public view_practice_detail(practice_id: String) {
    console.log(practice_id + ' DETAIL')
  }

  private initDataTable() {
    let aaa = this.tablaMenu;
    $('#datatableMenu').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatableMenu').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
        },
      });
    }, 10)
  }

  private initWizard() {
    console.log('*** iniciando WZ ***');
    $('#wizardCard').removeClass();
    // $('#wizardCard').trigger("reset");
    $('#wizardCard').bootstrapWizard({
      tabClass: 'nav nav-pills',
      nextSelector: '.btn-next',
      previousSelector: '.btn-back',
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
      // onTabShow: function (tab, navigation, index) {
      //   var $total = navigation.find('li').length;
      //   var $current = index + 1;
      //   var wizard = navigation.closest('.card-wizard');
      //   if ($current >= $total) {
      //     $(wizard).find('.btn-next').hide();
      //     $(wizard).find('.btn-finish').show();
      //   } else if ($current == 1) {
      //     $(wizard).find('.btn-back').hide();
      //   } else {
      //     $(wizard).find('.btn-back').show();
      //     $(wizard).find('.btn-next').show();
      //     $(wizard).find('.btn-finish').hide();
      //   }
      // },
      onLast: function (tab, navigation, index) {
        swal("Buen Trabajo!", "Haz culminado la práctica con éxito!", "success");
      }
    });

  }
}
