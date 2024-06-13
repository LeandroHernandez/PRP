import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from '../../../models/class/classdocumentSubject';
import {MatTabGroup, MatTabChangeEvent} from '@angular/material/tabs';
import {TeacherSubjectsService} from '../../../services/teacher-subjects/teacher-subjects.service';
import {LoadDataService} from '../../../services/teacher-subjects/load-data.service';
import swal from 'sweetalert2';
/**Models */
import {DataTable} from 'app/models/interfaces/data-table';
import {FileItem} from '../../../models/class/class.file-item';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Teacher} from '../../../models/teacher/teacher.model';
import {Video} from '../../../models/external_resources/video.model';
import {ForumDocument} from 'app/models/class/class.documentforo';
import {ForumServiceService} from '../../../services/forum-service/forum-service.service';
import {ForumQuestionDocument} from 'app/models/class/class.documentforumquestion';
import {Resource, Evaluation} from '../../../models/class/class.resource';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {filter} from 'rxjs-compat/operator/filter';
import {take, map} from 'rxjs/operators';
import {async} from '@angular/core/testing';
import {DocumentForumAnswer} from '../../../models/class/class.documentforoanswer';
import {TextlistService} from "../../../services/textlist/textlist.service";
import {element} from "protractor";
import {any} from "codelyzer/util/function";
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";

declare var $: any;

@Component({
  selector: 'app-list-subjects-teacher',
  templateUrl: './list-subjects-teacher.component.html',
  styleUrls: ['./list-subjects-teacher.component.css']
})

export class ListSubjectsTeacherComponent implements OnInit {
  @Input() subjectInput;
  @Output() messageEvent = new EventEmitter<boolean>();
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public pUnit;
  public units: any = []; // array of all units
  public classes: any[];
  public activeTeacher: Teacher; // active teacher
  public activeSubject: Subject; // active subject
  public activeUnit: any; // active unit selected
  public activeClass: any; // active class selected
  public selectedResource: Resource; // selected resource to add to class
  public isShowDetails = true;
  public typeNote: string;
  /* Declaración de formularios*/
  newClassForm: FormGroup;
  newNoteForm: FormGroup;
  newUnitForm: FormGroup;
  newResourceForm: FormGroup;
  urlVideoForm: FormGroup;
  urlVideoClassForm: FormGroup;
  newClassForumForm: FormGroup;
  /* External resources */
  public externalResources: any = {};
  public practices: any[] = [];
  public essays: Adminpractices[] = [];
  public unitResources: any = {};
  public dataTable: DataTable;
  listBooks2 :any[ ]=[];
  /* Drag drop vars */
  isOverDiv = false;
  files: FileItem[] = [];
  urls = [];
  public id = '';
  public dat = {controls: 0, showinfo: 0};
  private player: any;
  public selectedVideo: string;
  public selectedPdf: string;
  tablaResource: any;
  tableResourceVideos: any;
  tableResourcePractices: any;
  tableResourceEssays: any;
  tableResourceEvaluations: any;
  public question: string;
  public claseSelected;
  public forumsArray: any = [];
  public withInitQuestion = true;
  public arrayEvaluations: Array<Adminpractices> = [];
  public selectedEvaluation: Evaluation;
  public status: boolean;
  public isEdit = false;
  public unitEdit: any;
  public editButton: boolean;
  public editRow: number;
  arrayPorcentaje: number[];
  totalEvaluation: number;
  totalUnits: number;
  /* Simulator*/
  public showViewSimulation = false;
  public simClass: any;
  public academicPeriodStorage;

  constructor(public ts: TeacherSubjectsService,
              private fb: FormBuilder,
              public carga: LoadDataService,
              private forumService: ForumServiceService,
              private lisText2Service: TextlistService,
              private firestore: AngularFirestore,
  ) {
  }

  OnInit(): void{
     this.getText2List();
  }
  /* GET METHODS*/

  /* Get all units from active subject */
  getSubjectUnits(subject) {
    this.units = [];
    this.ts.getUnitsNoRealTimeQuery(this.activeTeacher, subject, this.academicPeriodStorage[0].academic_year_name)
        .then(doc => {
          if (!doc.empty) {
            doc.forEach(x => {
              if (x.data().statusUnit) {
                this.units.push(x.data())
              }
            })
            this.activeUnit = this.units[0];
            this.getTotalFromUnit();
            this.getClassFromUnit(this.activeUnit, this.activeSubject);
            this.getUnitResources(this.activeUnit, this.activeSubject);
          } else {
            this.units = [];
            console.log('DATA NOT FOUND')
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
  }

// getBooks2(){
//     this.lisText2Service.getText2List().subscribe(data =>{
//       this.listBooks2 = [];
//       data.forEach((element:any)=>{
//          this.listBooks2.push({
//            id: element.payload.collection('external_resourses').doc('uploaded_files').collection('textbooks').doc.id,
//           ...element.payload.collection('external_resourses').doc('uploaded_files').collection('textbooks').doc.data(),
//         })
//         // console.log(element.payload.doc.id);
//         // console.log(element.payload.collection('external_resourses').doc('uploaded_files').collection('textbooks').doc.data());
//       });
//        console.log(this.listBooks2)
//     });
//
// };
  getText2List() {
      this.lisText2Service.getText2List().subscribe(data => {
        this.listBooks2 = [];
        data.forEach((element: any) => {
          this.listBooks2.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          });
        });
        console.log(this.listBooks2);
      });
    }

  getTotalFromUnit() {
    this.totalUnits = 0
    this.units.forEach(u => {
      this.totalUnits = this.totalUnits + u.pUnit;
    })
  }

  validarTotal(e) {
    this.activeUnit.pUnit = e;
    this.getTotalFromUnit();
    if (this.totalUnits > 100) {
      swal({
        title: 'Error',
        text: 'Las unidades no deben pasar del 100%!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
    }
    return;
  }

  /* Get all clases from active unit*/
  async getClassFromUnit(unit, subject) {
    this.totalEvaluation = 0;
    if (unit !== undefined) {
      await this.ts.getClassFromUnit(this.activeTeacher, unit, subject, this.academicPeriodStorage[0].academic_year_name)
          .subscribe(resp => {


            this.classes = this.sortList(resp);

            this.classes.forEach(async item => {
              await this.ts.getClassResources(this.activeTeacher, this.activeUnit, this.activeSubject, item, this.academicPeriodStorage[0].academic_year_name).subscribe(resource => {
                item.class_resources = resource
              })
              await this.ts.getClassEvaluations(this.activeTeacher, this.activeUnit, this.activeSubject, item, this.academicPeriodStorage[0].academic_year_name)
                  .subscribe(evaluation => {
                    item.class_evaluation = evaluation;
                    this.getTotalEvaluation();
                  })
            })
            this.getforums(unit, subject, this.classes);
          });
    }
  }

  private sortList(documentForumAnswerList: any) {
    return documentForumAnswerList.sort(function (a, b) {
      if (a.class_id > b.class_id) {
        return -1;
      }
      if (a.class_id < b.class_id) {
        return 1;
      }
      return 0;
    });
  }


  async getTotalEvaluation() {
    this.totalEvaluation = 0;
    this.classes.forEach(c => {
      if (c.class_evaluation) {
        c.class_evaluation.forEach(cl => {
          if (cl.evaluation_peso !== undefined) {
            this.totalEvaluation = this.totalEvaluation + cl.evaluation_peso;
          }
        });
      }
    })
  }

  /* Get unit resources */
  getUnitResources(unit, subject) {
    if (unit !== undefined) {
      this.ts.getUnitResources(this.activeTeacher, unit, subject, this.academicPeriodStorage[0].academic_year_name).subscribe(unitResouce => {
        this.unitResources.text = unitResouce;
      });
      this.ts.getExternalFiles(this.activeSubject).pipe(map((resource: any) =>
          resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === unit.unit_id))).subscribe(files => {
        this.externalResources.files = files;
      })
      this.ts.getURLS(this.activeSubject).pipe(map((resource: any) =>
          resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === unit.unit_id))).subscribe(urls => {
        this.externalResources.urls = urls;
      })
      this.ts.getVideoConferenciaFromUnit(this.activeTeacher, subject, unit, this.academicPeriodStorage[0].academic_year_name).subscribe( resp => {
        this.unitResources['video_conferences'] = resp['video_conferences'];
      });
    }
  }

  /* Get external resources */
  getExternalResources() {
    this.ts.getExternalVideos(this.activeSubject).subscribe(videos => {
      this.externalResources.videos = videos;
      this.initDataTableVideos()
    });
    this.ts.getExternalTexts(this.activeSubject).subscribe(text => {
      this.externalResources.text = text;
      // console.log('AQUI' + text)
      this.initDataTable()
    });
    this.ts.getExternalFiles(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id))).subscribe(files => {
      this.externalResources.files = files;
    })
    this.ts.getURLS(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id))).subscribe(urls => {
      this.externalResources.urls = urls;
    })
    this.ts.getPractices(this.activeTeacher.teacher_unit_educational[0]).pipe(map((practice: Adminpractices[]) =>
        practice.filter(p => p.subject_id === this.activeSubject.subject_id && p.grade_id === this.activeSubject.grade_id
            && p.public_status_practice === true))).subscribe(practices => {
      this.practices = practices;
      this.initDataTablePractices();
    })
    this.ts.getEssays(this.activeTeacher.teacher_unit_educational[0]).pipe(map((essays: Adminpractices[]) =>
        essays.filter(e => e.subject_id === this.activeSubject.subject_id && e.grade_id === this.activeSubject.grade_id
            && e.public_status_practice === true))).subscribe(essays => {
      this.essays = essays;
      this.initDataTableEssays();
    })
    this.ts.getEvaluationsFromUnitEducationalId(this.activeTeacher.teacher_unit_educational[0]).pipe(
        map((evaluations: Adminpractices[]) => evaluations.filter(e => e.subject_id === this.activeSubject.subject_id
            && e.grade_id === this.activeSubject.grade_id && e.public_status_practice === true))).subscribe(evaluations => {
      this.arrayEvaluations = evaluations;
      this.initDataTableEvaluations();
    })
  }

  /* SET METHODS */

  /* Set selected resource to add to class*/
  setSelectedResource(subModule, type) {
    this.selectedEvaluation = undefined;
    this.selectedResource = undefined;
    switch (type) {
      case 'text': {
        this.selectedResource = {
          resource_des: subModule.competencies,
          resource_name: subModule.textbook_title,
          resource_status: false,
          resource_rubric: false,
          resource_type: type,
          resource_url: subModule.url
        };
      }
        break;
      case 'video': {
        this.selectedResource = {
          resource_des: subModule.competencies,
          resource_name: subModule.textbook_title,
          resource_status: false,
          resource_rubric: false,
          resource_type: type,
          resource_url: subModule.url
        };

      }
        break;
      case 'practice': {
        this.selectedResource = {
          resource_id: subModule.practice_id,
          resource_des: subModule.practice_name,
          resource_name: subModule.practice_name,
          resource_status: false,
          resource_rubric: false,
          resource_type: type,
          resource_url: `/practices/${subModule.practice_id}`
        };
      }
        break;
      case 'essay': {
        this.ts.getRubricEssay(subModule.essay_id)
            .then(doc => {
              if (!doc.empty) {
                this.selectedResource = {
                  resource_id: subModule.essay_id,
                  resource_des: subModule.essay_name,
                  resource_name: subModule.essay_name,
                  resource_status: false,
                  resource_rubric: true,
                  resource_type: type,
                  resource_url: `/essays/${subModule.essay_id}`
                };
                console.log('DATA FOUND')
              } else {
                console.log('DATA NOT FOUND')
                this.selectedResource = {
                  resource_id: subModule.essay_id,
                  resource_des: subModule.essay_name,
                  resource_name: subModule.essay_name,
                  resource_status: false,
                  resource_rubric: false,
                  resource_type: type,
                  resource_url: `/essays/${subModule.essay_id}`
                };
              }
            })
            .catch(function (error) {
              console.log('Error getting document:', error);
            });
      }
        break;
      case 'evaluation': {
        this.selectedEvaluation = {
          evaluation_des: subModule.evaluation_name,
          evaluation_name: subModule.evaluation_name,
          evaluation_status: false,
          evaluation_type: type,
          evaluation_url: `/evaluation/${subModule.evaluation_id}`
        };
      }
        break;
      case 'file': {
        this.selectedResource = {
          resource_des: 'Attached File',
          resource_name: subModule.nombre,
          resource_status: false,
          resource_rubric: false,
          resource_type: type,
          resource_url: subModule.url
        };
      }
        break;
      case 'url': {
        this.selectedResource = {
          resource_des: 'Attached File',
          resource_name: 'Link: ' + subModule.url,
          resource_status: false,
          resource_rubric: false,
          resource_type: type,
          resource_url: subModule.url
        };
      }
        break;
    }
  }

  /* Set active unit for queries */
  setActiveUnit(index) {
    this.activeUnit = this.units[index];
    this.getClassFromUnit(this.activeUnit, this.activeSubject);
    this.getUnitResources(this.activeUnit, this.activeSubject);
  }

  /* ADD METHODS */


  /* add selected resource to selected class */
  addResourceToClass() {
    if (this.activeUnitClass.value.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder agregar recursos!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else if (this.selectedEvaluation !== undefined && this.activeUnitClass.value.class_evaluation.length > 0) {
      swal({
        title: 'Error',
        text: 'Ya tiene una evaluación asignada a la clase!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      const selectedClass = this.activeUnitClass.value;
      if (this.selectedResource !== undefined) {
        this.ts.setResourceToClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, this.selectedResource, this.academicPeriodStorage[0].academic_year_name);
      }
      if (this.selectedEvaluation !== undefined) {
        this.ts.setEvaluationToClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, this.selectedEvaluation, this.academicPeriodStorage[0].academic_year_name);
      }

      this.newResourceForm.reset({
        unitClass: ''
      });
      $('#ModalAddToClass').modal('hide');
      swal({
        title: 'Ok',
        text: 'Se ha agregado el recurso a la clase correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop)
    }
    this.selectedEvaluation = undefined;
  }

  /* add selected resource to unit */
  addResourceToUnit(list) {
    this.ts.setResourceToUnit(this.activeTeacher, this.activeSubject, this.activeUnit, list, this.academicPeriodStorage[0].academic_year_name);
    $('#ModalAddText').modal('hide');
    // swal({
    //     title: 'Ok',
    //     text: 'Se han agregado los textos correctamente!',
    //     buttonsStyling: false,
    //     confirmButtonClass: 'btn btn-fill btn-success',
    //     type: 'success'
    // }).catch(swal.noop)


  }

  /* Add class to active subject*/
  addClassToSubject() {
    if (this.newClassForm.invalid) {
      return Object.keys(this.newClassForm.controls).forEach((control) => {
        this.newClassForm.controls[control].markAsTouched();
      });
    }
    if (!this.isEdit) {
      this.ts.setClassToSubject(this.activeTeacher, this.newClassForm.value, this.activeSubject, this.activeUnit, this.academicPeriodStorage[0].academic_year_name)
          .then(() => {
            swal({
              title: 'Ok!',
              text: 'Clase creada correctamente',
              type: 'success',
              allowOutsideClick: false,
              allowEnterKey: true
            }).then(() => {
              this.getClassFromUnit(this.activeUnit, this.activeSubject);
            });
          })
          .catch(e => console.log(e));
    } else if (this.isEdit) {
      this.ts.editClassToSubject(this.activeTeacher, this.newClassForm.value, this.activeSubject, this.activeUnit, this.academicPeriodStorage[0].academic_year_name)
          .then(() => {
            swal({
              title: 'Ok!',
              text: 'Clase editada correctamente',
              type: 'success',
              allowOutsideClick: false,
              allowEnterKey: true
            }).then(() => {
              this.getClassFromUnit(this.activeUnit, this.activeSubject);
            });
          })
          .catch(e => console.log(e));
    }

  }

  public newClass() {
    this.isEdit = false;
    this.newClassForm = this.fb.group({
      fromDate: [this.currentDate(), Validators.required],
      toDate: [this.currentDate(), Validators.required],
      className: [''],
      status: [false]
    });
  }

  /* Agrega una unidad a la materia seleccionada */
  addUnit() {
    if (this.newUnitForm.invalid) {
      return Object.keys(this.newUnitForm.controls).forEach((control) => {
        this.newUnitForm.controls[control].markAsTouched();
      });
    }
    if (!this.isEdit) {
      this.ts.setTeacherSubjectUnit(this.activeTeacher, this.newUnitForm.value, this.academicPeriodStorage[0].academic_year_name)
          .then(() => {
            swal({
              title: 'Ok!',
              text: 'Unidad creada correctamente',
              type: 'success',
              allowOutsideClick: false,
              allowEnterKey: true
            }).then(() => {
              this.getSubjectUnits(this.activeSubject);
            });
          })
          .catch(e => console.log(e));
    } else if (this.isEdit) {
      this.ts.editTeacherSubjectUnit(this.activeTeacher, this.newUnitForm.value, this.academicPeriodStorage[0].academic_year_name)
          .then(() => {
            swal({
              title: 'Ok!',
              text: 'Unidad editada correctamente',
              type: 'success',
              allowOutsideClick: false,
              allowEnterKey: true
            }).then(() => {
              this.getSubjectUnits(this.activeSubject);
            });
          })
          .catch(e => console.log(e));
    }

    this.isEdit = false;
  }

  public editUnit(unit) {
    this.isEdit = true;
    this.unitEdit = unit;
    this.newUnitForm = this.fb.group({
      subject: [this.activeSubject.subject_id, Validators.required],
      grade: [this.activeSubject.grade_id, Validators.required],
      parallel: [this.activeSubject.parallel_id, Validators.required],
      unit_id: [this.unitEdit.unit_id],
      fromDate: [this.unitEdit.fromDate, Validators.required],
      toDate: [this.unitEdit.toDate, Validators.required],
      unitName: [this.unitEdit.unitName],
      pUnit: [this.unitEdit.pUnit],
    });
  }

  public newUnit() {
    this.isEdit = false
    //  this.newUnitForm.reset()
    this.newUnitForm = this.fb.group({
      subject: [this.activeSubject.subject_id, Validators.required],
      grade: [this.activeSubject.grade_id, Validators.required],
      parallel: [this.activeSubject.parallel_id, Validators.required],
      fromDate: [this.currentDate(), Validators.required],
      toDate: [this.currentDate(), Validators.required],
      statusUnit: true,
      unitName: [''],
      pUnit: [''],
    });
  }

  public editClass(clase) {
    this.isEdit = true;
    if (clase.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder editarla!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).then((result) => {
        $('#ModalAddClass').modal('hide');
      })
      return;
    } else {
      this.newClassForm = this.fb.group({
        fromDate: [clase.fromDate, Validators.required],
        toDate: [clase.toDate, Validators.required],
        className: [clase.className],
        status: [clase.class_status],
        class_id: [clase.class_id],
      });
    }

  }

  /** add forum status */

  /* set forrums of each class*/
  getforums(unit, subject, clases) {
    this.forumsArray = [];
    clases.forEach(async element => {
      await this.forumService.findForumClass(this.activeTeacher.teacher_unit_educational[0],
          subject.parallel_id, subject.subject_id, unit.unit_id, element.class_id)
          .subscribe(forums => {
            if (forums !== undefined) {
              this.forumsArray.push(forums);
            }
          });
    });
  }

  onChange(e) {
    if (this.status) {
      this.status = !this.status;
    } else {
      this.status = !this.status;
    }
  }

  findForum(classSelected, index) {
    // console.log(this.forumsArray[index])
    this.newClassForumForm.reset();
    this.claseSelected = classSelected;
    if (this.forumsArray[index] !== undefined) {
      if (this.forumsArray[index].forum_id === this.claseSelected.class_id) {
        const createDate = this.forumsArray[index].forum_expiry_creation.split(' ');
        const expDate = this.forumsArray[index].forum_expiry_date.split(' ');
        this.newClassForumForm = this.fb.group({
          forum_expiry_creation: [createDate[0], Validators.required],
          forum_expiry_date: [expDate[0], Validators.required],
          forum_status: [this.forumsArray[index].forum_status, Validators.required],
          forum_id: [this.claseSelected.class_id],
          creation_time: [createDate[1], Validators.required],
          expiry_time: [expDate[1], Validators.required],
        });
        this.status = this.forumsArray[index].forum_status
        this.withInitQuestion = false;
        this.addForum();
      }
    } else {
      this.status = false;
      this.withInitQuestion = true;
      this.addForum();
    }
  }

  addForum() {
    $('#ModalAddClassForum').modal('show');
    this.getClassFromUnit(this.activeUnit, this.activeSubject);
  }

  saveForum() {
    if (this.newClassForumForm.invalid) {
      return Object.keys(this.newClassForumForm.controls).forEach((control) => {
        this.newClassForumForm.controls[control].markAsTouched();
      });
    }
    const obj = Object.assign({}, this.newClassForumForm.getRawValue());
    let forum: ForumDocument;
    forum = {
      forum_id: this.claseSelected.class_id,
      forum_expiry_date: `${obj.forum_expiry_date} ${obj.expiry_time}`,
      forum_expiry_creation: `${obj.forum_expiry_creation} ${obj.creation_time}`,
      forum_status: obj.forum_status
    }
    // Validar en esta seccion que unidad educativa debemos seleccionar.
    this.forumService.createForum(this.activeTeacher.teacher_unit_educational[0], this.activeSubject.parallel_id,
        this.activeSubject.subject_id, this.activeUnit.unit_id, forum).then(r => '');
    if (this.question !== undefined && this.question !== '') {
      const fecha = this.currentDateTime()
      const init_date = fecha.toLocaleString().split(' ');
      let forumQuestion: ForumQuestionDocument;
      forumQuestion = {
        question_id: new Date().getTime().toString(),
        id_user_creator: this.activeTeacher.teacher_id,
        question: this.question,
        user_type: 'profesor',
        question_date: init_date[0],
        question_time: init_date[1],
        question_status: true,
        studentAnswersList: [],
      }
      this.forumService.createForumQuestion(this.activeTeacher.teacher_unit_educational[0], this.activeSubject.parallel_id,
          this.activeSubject.subject_id, this.activeUnit.unit_id, this.claseSelected.class_id, forumQuestion).then(r => '');
    }
    this.getClassFromUnit(this.activeUnit, this.activeSubject);
  }

  /* Add note to unit or class */
  addNote(typeNote: string) {
    if (this.newNoteForm.invalid) {
      return Object.keys(this.newNoteForm.controls).forEach((control) => {
        this.newNoteForm.controls[control].markAsTouched();
      });
    }
    if (typeNote === 'class') {
      this.activeClass.class_notes.push(this.newNoteForm.value);
    } else if (typeNote === 'unit') {
      this.activeUnit.unit_notes.push(this.newNoteForm.value);
    }

    this.ts.setNote(this.activeTeacher, this.newNoteForm.value, typeNote, this.activeSubject, this.activeUnit, this.activeClass, this.academicPeriodStorage[0].academic_year_name)
        .then(() => {
          swal({
            title: 'Ok!',
            text: 'Nota creada correctamente',
            type: 'success',
            allowOutsideClick: false,
            allowEnterKey: true
          }).then(() => {
            this.newNoteForm.reset();
          });
        })
        .catch(e => console.log(e));
  }

  /* UPDATE */

  /* Reorder resources, save in firebase */
  reorderResources(event: CdkDragDrop<string[]>, list: any[], selectedClass) {
    if (selectedClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder editarla!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      const antes = event.previousIndex;
      const nuevo = event.currentIndex;
      moveItemInArray(list, antes, nuevo);
      list[nuevo].resource_index = nuevo;
      list[antes].resource_index = antes;
      this.ts.updateResourceIndex(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, list, this.academicPeriodStorage[0].academic_year_name)
    }

  }

  /* Update class status */
  updateClassStatus(selectedClass) {
    if (selectedClass.class_resources.length > 0 || selectedClass.class_evaluation.length > 0) {
      selectedClass.class_status = !selectedClass.class_status;
      this.ts.updateClassStatus(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, this.academicPeriodStorage[0].academic_year_name);
    } else {
      if (selectedClass.class_status === false) {
        swal({
          title: 'Error',
          text: 'No puede activar una clase sin recursos como: prácticas, evaluaciónes, adjuntos',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-warning',
          type: 'warning'
        }).catch(swal.noop)
      } else {
        selectedClass.class_status = !selectedClass.class_status;
        this.ts.updateClassStatus(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, this.academicPeriodStorage[0].academic_year_name);
      }
    }
  }

  /* delete resource*/
  deleteResource(resource, selectedClass) {
    if (selectedClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder eliminar el recurso!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      swal({
        title: 'Atención',
        text: 'Seguro que desea borrar el recurso',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.value) {

          this.ts.deleteResourceFromClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, resource, this.academicPeriodStorage[0].academic_year_name)

          swal({
            title: 'OK',
            text: 'Se elimino el recurso correctamente',
            type: 'success',
          })
        }
      })
    }

  }

  public deleteEvaluation(evaluation, selectedClass) {
    if (selectedClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder eliminar la evaluación!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      swal({
        title: 'Atención',
        text: 'Seguro que desea borrar la evaluación',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.value) {
          this.ts.deleteEvaluationFromClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, evaluation, this.academicPeriodStorage[0].academic_year_name)
              .then(() => {
                swal({
                  title: 'Ok',
                  text: 'Evaluación eliminada',
                  type: 'success'
                })
              });
        }
      })
    }

  }

  deleteResourceList(video) {
    video.selected = false;
  }

  public deleteResourceFileOrUrl(data, type) {
    if (type === 'file') {
      this.ts.deleteExternalFiles(data.resource_id);
    } else if (type === 'url') {
      this.ts.deleteURLS(data.resource_id)
    }
    swal({
      title: 'Ok',
      text: 'Se ha eliminado correctamente el recurso!',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-fill btn-success',
      type: 'success'
    }).catch(swal.noop)
  }

  ngOnInit(): void {
    this.activeUnit = {}
    this.arrayPorcentaje = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    this.initYoutube();
    this.activeSubject = this.subjectInput;
    this.activeTeacher = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
    this.getSubjectUnits(this.activeSubject);
    this.getExternalResources();
    this.tablaResource = $('#datatablesResource').DataTable({});
    this.tableResourceVideos = $('#datatablesResourceVideos').DataTable({})
    this.tableResourcePractices = $('#datatablesResourcePractices').DataTable({})
    this.tableResourceEssays = $('#datatablesResourceEssays').DataTable({})
    this.tableResourceEvaluations = $('#datatablesResourceEvaluations').DataTable({})
    this.activeClass = {};
    this.editButton = false;
    this.editRow = 0;
    this.dataTable = {
      headerRow: ['Seleccionar', 'Nombre', 'Ver'],
      footerRow: ['Seleccionar', 'Nombre', 'Ver'],
      dataRows: []
    };
    /* Init new class form */
    this.newClassForm = this.fb.group({
      fromDate: [this.currentDate(), Validators.required],
      toDate: [this.currentDate(), Validators.required],
      className: [''],
      status: [false]
    });
    /* Init new class form */
    this.newClassForumForm = this.fb.group({
      forum_expiry_creation: [this.currentDate(), Validators.required],
      forum_expiry_date: [this.currentDate()],
      forum_status: [true],
      forum_id: [''],
      creation_time: ['', Validators.required],
      expiry_time: [''],
    });

    /* Init new note form */
    this.newNoteForm = this.fb.group({
      note_title: ['', Validators.required],
      note_content: ['', Validators.required],
    });
    /* Init new unit form */
    this.newUnitForm = this.fb.group({
      subject: [this.activeSubject.subject_id, Validators.required],
      grade: [this.activeSubject.grade_id, Validators.required],
      parallel: [this.activeSubject.parallel_id, Validators.required],
      fromDate: [this.currentDate(), Validators.required],
      toDate: [this.currentDate(), Validators.required],
      unitName: [''],
      pUnit: [''],
    });
    /* Init new resource form*/
    this.newResourceForm = this.fb.group({
      unitClass: ['', Validators.required]
    });
    this.urlVideoForm = this.fb.group({
      urlVideoC: ['', Validators.required],
      detailsVideoC: ['', Validators.required],
      toDate: [this.currentDate(), Validators.required],
      toHours: [this.currentDate(), Validators.required],
      // state_vc: [true],
    });
    this.urlVideoClassForm = this.fb.group({
      urlVideoClass: ['', Validators.required],
    });

    $('#datetimepicker1').datetimepicker();

  }

  changeP(e, evaluation, unitClass) {
    console.log('PESO DE EVALUACION')
    this.activeClass = unitClass
    this.selectedEvaluation = evaluation;
    this.selectedEvaluation.evaluation_peso = e;
    this.ts.updateEvaluationToClass(this.activeTeacher, this.activeSubject, this.activeUnit, this.activeClass, this.selectedEvaluation, this.academicPeriodStorage[0].academic_year_name)
        .then(() => '');
  }

  changePEssay(e, essay, unitClass) {
    this.ts.updateEssayWeigh(this.activeTeacher, this.activeSubject, this.activeUnit, unitClass, essay, e, this.academicPeriodStorage[0].academic_year_name);
  }


  OpenPopupCenter(pageURL, title, w, h) {
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    const targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      this.practices;
      this.initDataTablePractices()
    }
    if (tabChangeEvent.index === 1) {
      this.arrayEvaluations;
      this.initDataTableEvaluations()
    }
    if (tabChangeEvent.index === 2) {
      this.essays;
      this.initDataTableEssays()
    }
  }

  /**
   * Inicializa la datatable student
   */
  initDataTable() {
    let aaa = this.tablaResource;
    $('#datatablesResource').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResource').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableVideos() {
    let aaa = this.tableResourceVideos;
    $('#datatablesResourceVideos').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourceVideos').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTablePractices() {
    let aaa = this.tableResourcePractices;
    $('#datatablesResourcePractices').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourcePractices').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableEvaluations() {
    let a = this.tableResourceEvaluations;
    $('#datatablesResourceEvaluations').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/

      a = $('#datatablesResourceEvaluations').DataTable({

        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableEssays() {
    let aaa = this.tableResourceEssays;
    $('#datatablesResourceEssays').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourceEssays').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  get activeUnitClass() {
    return this.newResourceForm.get('unitClass');
  }

  /* Show video preview */
  previewVideo(video) {
    this.selectedVideo = video.subject_name + ' : ' + video.textbook_title;
    this.id = video.url.replace('https://youtu.be/', '');
  }

  previewPDF(pdfSelected) {
    this.selectedVideo = pdfSelected.textbook_title + ' : ' + pdfSelected.grade_name;
    this.selectedPdf = pdfSelected.url;
  }

  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  /* Redirect to parent component */
  showSubject() {
    this.isShowDetails = !this.isShowDetails;
    this.messageEvent.emit(this.isShowDetails)
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  cargarImagenes() {
    // const idNewFile = new Date();
    this.carga.uploadItems(this.files, this.urls, this.activeSubject, this.activeUnit);
    this.ts.getExternalFiles(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === this.activeUnit.unit_id))).subscribe(files => {
      this.externalResources.files = files;
    });
    this.ts.getURLS(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === this.activeUnit.unit_id))).subscribe(urls => {
      this.externalResources.urls = urls;
    });
    $('#ModalAddMaterial').modal('hide');
    /*swal({
        title: 'Ok',
        text: 'Se han agregado los archivos correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
    }).catch(swal.noop)*/
  }

  public addExternalFiles() {
    this.urls = []
    this.files = []
  }

  currentDateTime() {
    const date = new Date();
    return date.toLocaleString();
  }

  uploadImages() {
    this.carga.uploadItems(this.files, this.urls, this.activeSubject, this.activeUnit);

    this.ts.getExternalFiles(this.activeSubject).subscribe(files => {
      this.externalResources.files = files;
    });
    this.ts.getURLS(this.activeSubject).subscribe(urls => {
      this.externalResources.urls = urls;
    });
  }

  cleanFiles() {
    this.files = [];
  }

  private initYoutube() {
    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    $('#lost').on('hidden', function () {
      $(this).data('modal', null);
    });
  }

  savePlayer(player) {
    this.player = player.target;
  }

  public stopVideo() {
    this.player.stopVideo();
  }

  onStateChange(event) {
    console.log('player state', event.data);
  }

  public confirmResourceVideo() {
    $('#ModalAddVideo').modal('hide');
    /*swal({
        title: 'Ok',
        text: 'Se han agregado los videos correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
    }).catch(swal.noop)*/
  }

  public confirmResourcePractice() {
    $('#ModalAddEssay').modal('hide');
    /*swal({
        title: 'Ok',
        text: 'Se han agregado los recursos correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
    }).catch(swal.noop)*/
  }

  addLinkVideoC(classSelected, index) {
    this.claseSelected = classSelected;
    const video_conference = this.claseSelected.video_conference;

    if (this.claseSelected.video_conference) {
      this.urlVideoForm = this.fb.group({
        urlVideoC: [video_conference.urlVideoC, Validators.required],
        detailsVideoC: [video_conference.detailsVideoC, Validators.required],
        toDate: [video_conference.toDate, Validators.required],
        toHours: [video_conference.toHours, Validators.required],
        // state_vc: [video_conference.state_vc, Validators.required],
      });
    } else {
      this.urlVideoForm.reset();
    }
    $('#ModalAddLinkVideoClass').modal('show');
  }

  saveVideoC() {
    this.ts.saveVideoConferenciaToUnit(this.activeTeacher, this.activeSubject, this.activeUnit, this.urlVideoForm.value, this.academicPeriodStorage[0].academic_year_name);
    $('#ModalAddVideoConference').modal('hide');
    swal({
      title: 'Ok',
      text: 'Se ha agregado la información de la video conferencia!',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-fill btn-success',
      type: 'success'
    }).then(() => {
      this.getUnitResources(this.activeUnit, this.activeSubject);
    }).catch(swal.noop)
    /*this.activeClass = this.claseSelected;
    if (this.activeClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder editarla!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      const selectedClass = this.activeClass;
      this.ts.saveVideoConferenciaToUnit(this.activeTeacher, this.activeSubject, this.activeUnit, this.urlVideoForm.value);
      $('#ModalAddToClass').modal('hide');
      swal({
        title: 'Ok',
        text: 'Se ha agregado la información de la video conferencia!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop)
    }*/
  }

  deleteVideo(video) {
    swal({
      title: 'Atención',
      text: 'Seguro que desea borrar el link de video',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this.ts.deleteVideoConferenciaFromUnit(this.activeTeacher, this.activeSubject, this.activeUnit, video, this.academicPeriodStorage[0].academic_year_name)
            .then(() => {
              swal({
                title: 'OK',
                text: 'Se elimino el recurso correctamente',
                type: 'success',
              })
              this.getUnitResources(this.activeUnit, this.activeSubject)
            });
      }
    })
  }

  addVideoClass(classSelected, index) {
    this.claseSelected = classSelected;
    const video_class = this.claseSelected.video_class
    if (this.claseSelected.video_class) {
      this.urlVideoClassForm = this.fb.group({
        urlVideoClass: [video_class.urlVideoC, Validators.required],
      });
    } else {
      this.urlVideoClassForm.reset();
    }
    $('#ModalAddVideoClass').modal('show');
  }

  saveVideoClass() {
    this.activeClass = this.claseSelected;
    if (this.activeClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder editarla!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      const selectedClass = this.activeClass;
      this.ts.saveVideoClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, this.urlVideoClassForm.value, this.academicPeriodStorage[0].academic_year_name);
      $('#ModalAddToClass').modal('hide');
      swal({
        title: 'Ok',
        text: 'Se ha agregado un video a la clase!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop)
    }
  }

  public editClassNotes(typeNote: string, row: number) {
    if (typeNote === 'class') {
      this.newNoteForm.patchValue({
        note_content: this.activeClass.class_notes[row].note_content,
        note_title: this.activeClass.class_notes[row].note_title
      });
      this.typeNote = 'class';
    } else if (typeNote === 'unit') {
      this.newNoteForm.patchValue({
        note_content: this.activeUnit.unit_notes[row].note_content,
        note_title: this.activeUnit.unit_notes[row].note_title
      });
      this.typeNote = 'unit';
    }

    this.editButton = true;
    this.editRow = row;
  }

  public removeClassNotes(typeNote: string, row: number) {
    if (typeNote === 'class') {
      this.activeClass.class_notes.splice(row, 1);
    } else if (typeNote === 'unit') {
      this.activeUnit.unit_notes.splice(row, 1);
    }
    this.ts.setNote(this.activeTeacher, this.newNoteForm.value, typeNote, this.activeSubject, this.activeUnit, this.activeClass, this.academicPeriodStorage[0].academic_year_name)
        .then(() => {
          swal({
            title: 'Ok!',
            text: 'Nota Eliminada Correctamente',
            type: 'success',
            allowOutsideClick: false,
            allowEnterKey: true
          }).then(() => '');
        })
        .catch(e => console.log(e));
  }

  editNote(typeNote: string) {
    if (this.newNoteForm.invalid) {
      return Object.keys(this.newNoteForm.controls).forEach((control) => {
        this.newNoteForm.controls[control].markAsTouched();
      });
    }

    if (typeNote === 'class') {
      this.activeClass.class_notes[this.editRow] = this.newNoteForm.value;
    } else if (typeNote === 'unit') {
      this.activeUnit.unit_notes[this.editRow] = this.newNoteForm.value;
    }

    this.ts.setNote(this.activeTeacher, this.newNoteForm.value, typeNote, this.activeSubject, this.activeUnit, this.activeClass, this.academicPeriodStorage[0].academic_year_name)
        .then(() => {
          swal({
            title: 'Ok!',
            text: 'Nota editada correctamente',
            type: 'success',
            allowOutsideClick: false,
            allowEnterKey: true
          }).then(() => {
            this.newNoteForm.reset();
            this.editRow = 0;
            this.editButton = false;
          });
        })
        .catch(e => console.log(e));
  }

  updateUnitStatus(unit: any, index: number) {
    this.ts.updateStatusUnit(this.activeTeacher.teacher_unit_educational[0] as string,
        this.activeSubject.parallel_id as string,
        this.activeSubject.subject_id as string,
        unit.unit_id as string, !unit.statusUnit, this.academicPeriodStorage[0].academic_year_name);
    this.units[index].statusUnit = !unit.statusUnit;
  }

  enableUnit(statusUnit: boolean): boolean {
    if (statusUnit === undefined) {
      return false;
    }
    return statusUnit === true;
  }

  validateRubric(resource_rubric: any) {
    if (resource_rubric === undefined) {
      return false;
    } else {
      return resource_rubric !== false;
    }
  }

  // public getDataFromShort(data: any) {
  //     // console.log(data)
  //     this.ts.getRubricEssay(data.resource_url.replace('/practices/', ''))
  //         .then(doc => {
  //             if (!doc.empty) {
  //                 console.log('DATA FOUND')
  //             } else {
  //                 console.log('DATA NOT FOUND')
  //             }
  //         })
  //         .catch(function (error) {
  //             console.log('Error getting document:', error);
  //         });
  // }


  /* Iniciar simulador */
  public showSimulator(unitClass) {
    this.simClass = unitClass;
    this.showViewSimulation = true;
  }

  /** Cierra el modal de Practicas */
  public return() {
    this.showViewSimulation = false;
  }
}
