import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';
import {Subject} from '../../../models/class/classdocumentSubject';
import {AngularFireStorage} from '@angular/fire/storage';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {StudentService} from 'app/services/student/student.service';
import {Studentdocum} from 'app/models/class/class.documentstudent';
import {UnitEdicationalService} from 'app/services/unit-edicational/unit-edicational.service';
import {SchoolGrade} from 'app/models/class/class.documentschoolGrade';
import {StudentSubjectsService} from 'app/services/student-subjects/student-subjects.service';
import {Resourcesdocum} from 'app/models/class/class.documentresources';
import {FormControl} from '@angular/forms';
import {Notesdocum} from 'app/models/class/class.documentnote';
import swal from 'sweetalert2';
import {formatDate} from '@angular/common';
import {ForumServiceService} from '../../../services/forum-service/forum-service.service';
import {ForumDocument} from '../../../models/class/class.documentforo';
import {Classdocum} from '../../../models/class/class.documentclass';
import {ForumQuestionDocument} from '../../../models/class/class.documentforumquestion';
import {DocumentForumAnswer} from '../../../models/class/class.documentforoanswer';
import {ForumQuestionDTO} from '../../../models/dto/ForumQuestionDTO';
import {Evaluation, Resource} from 'app/models/class/class.resource';
import {EvaluationSummary} from 'app/models/class/evaluation-summary';
import {filter} from 'rxjs-compat/operator/filter';
import {map, take} from 'rxjs/operators';
import {InformationEvaluationQuestion} from 'app/models/class/class.document-informationPracticeQuestion';
import {Adminpractices} from 'app/models/class/class.documentadminpractices';

declare var $: any;

@Component({
  selector: 'app-studentsubjects',
  templateUrl: './studentsubjects.component.html',
  styleUrls: ['./studentsubjects.component.css']
})
export class StudentsubjectsComponent implements OnInit {

  public selected = new FormControl(1);
  public arrayMaterias: Subject[];
  public subject: Subject;
  public isShowDetails = true;
  public isShowForum = false;
  public units = [];
  public class: any;
  public arrayText;
  public arrayNotes: Array<Notesdocum> = [];
  public classNotes: any;
  public numTask;
  public totalTask;
  public resourceUrl;
  public activeUnit: any;
  public student: Studentdocum;
  public gradedocum: SchoolGrade;
  public note_title;
  public note_content;
  public practices;
  public infoUser: Studentdocum;
  public showViewPractice = false;
  public showViewEssay = false;
  public classresource = [];
  public resourcedocum: Resourcesdocum;
  public practiceId;
  public essayId;
  public isEditResource = false;
  public classSelected: any;
  public notesClassSelected: any;
  public arrayTexts = [];
  public arrayPractices = [];
  public arrayVideos = [];
  public arrayResources = [];
  public arrayEssays = [];
  public percentageText = 0;
  public percentageVideos = 0;
  public percentagePractice = 0;
  public idIntent = '';
  public itemsInTrue = [];
  public indexClass: number;
  public arraypercentage: Array<Number> = [];
  public id = '';
  public dat = {controls: 0, showinfo: 0};
  private player: any;
  public lastResource = false;
  public indexResource = 0;
  public isResourceVideo = false;
  public isResourceText = false;
  public isResourceFile = false;
  public isResourceUrlYoutube = false;
  public isResourceUrl = false;
  private enabledListForum = [];
  public forumDocumentSelected: ForumDocument;
  public forumQuestionDocumentList: ForumQuestionDTO[];
  private classIdSelected: string;
  private unitIdSelected: string;
  public documentForumAnswerList: DocumentForumAnswer[];
  public documentForumBestAnswer: DocumentForumAnswer;
  public forumQuestionDocumentSave: ForumQuestionDocument;
  public documentForumAnswerSave: DocumentForumAnswer;
  public videoConference: any;
  public videoClass: any;

  public evaluation: Array<Adminpractices[]> = [];
  public startEvaluation = false;
  public evaluationId: String;
  public evaluationSelect: Evaluation;
  public timeout = null;
  public minSpend;
  public studentClass = [];
  public unidades = [];
  public classToWork = [];
  public studencallsWorked = [];
  public url: SafeResourceUrl;
  public idYoutube: String;
  public pendingClassStatus: Array<boolean> = [];
  public statusNotesFromClass: Array<Boolean> = [];
  public evaluationIDCreation = '';
  public periodAcademicStorage;

  constructor(private storage: AngularFireStorage,
              private sanitizer: DomSanitizer,
              private studentService: StudentService,
              private unitEdicationalService: UnitEdicationalService,
              private studenSubjectService: StudentSubjectsService,
              private forumService: ForumServiceService,
  ) {
  }

  ngOnInit(): void {
    this.videoConference = {};
    this.videoClass = {};
    this.student = JSON.parse(localStorage.getItem('infoUser'));
    this.periodAcademicStorage = JSON.parse(localStorage.getItem('academic_period'));
    this.numTask = 7;
    this.totalTask = 10;
    this.resourceUrl = this.sanitizerUrl('');
    this.arrayMaterias = []
    this.arrayText = [];
    this.initYoutube();
    this.resourcedocum = {};
    this.getStudent();
    this.isShowForum = false;
    this.forumDocumentSelected = new ForumDocument();
    this.documentForumBestAnswer = new DocumentForumAnswer();
    this.forumQuestionDocumentSave = new ForumQuestionDocument();
    this.documentForumAnswerSave = new DocumentForumAnswer();
  }

  /**
   * Obtiene los datos del estudiante (provisional, debe del capturar el usuario logueado)
   */
  async getStudent() {
    await this.studentService.getstudent(this.student.student_id).subscribe(async students => {
      if (students !== undefined) {
        this.student = students;
        await this.getSubject(this.student.student_unit_educational, this.student.student_grade_id);
      }
    })
  }

  /**
   * obtiene las materias segun el subnivel del estudiante.
   * @student_unit_educational
   * @student_grade_id
   */
  getSubject(student_unit_educational, student_grade_id) {
    if (student_grade_id !== '') {
      this.unitEdicationalService
          .getGrades(student_unit_educational, student_grade_id, this.periodAcademicStorage[0].academic_year_name).subscribe(grade => {
        if (grade !== undefined && grade.length !== 0) {
          this.gradedocum = grade;
          this.unitEdicationalService
              .getSubjectBySublevelId(student_unit_educational, this.gradedocum.sublevel_id, this.periodAcademicStorage[0].academic_year_name).subscribe(subjects => {
            this.arrayMaterias = subjects.filter( sub => {
              return sub.subject_status;
            });
            this.getAllUnits()
          });
        }
      });
      this.getAllUnits()

    } else {
      this.arrayMaterias = [];
    }
  }


  async showSubjectInit(subject_id) {
    await this.studenSubjectService.getSubjectUnit(this.student.student_unit_educational,
        this.student.student_parallel_id, this.subject.subject_id, this.periodAcademicStorage[0].academic_year_name).subscribe(units => {

    });
  }

  /**
   * Muestra los detalles de la materia seleccionada (unidades)
   */
  async showSubject(subject: Subject) {
    this.lastResource = false;
    this.indexResource = 0;
    this.subject = subject;
    await this.studenSubjectService
        .getSubjectUnit(this.student.student_unit_educational,
            this.student.student_parallel_id, this.subject.subject_id, this.periodAcademicStorage[0].academic_year_name)
        .subscribe(units => {
          this.units = [];
          if (units !== undefined && units.length !== 0) {
            for (const aux of units as any) {
              if (aux.statusUnit !== undefined) {
                if (aux.statusUnit === true) {
                  this.units.push(aux)
                }
              }
            }
            this.activeUnit = this.units[0];
            // console.log(this.activeUnit)
            if (units[0]['unit_notes'] !== undefined) {
              this.arrayNotes = units[0]['unit_notes'];
              this.viewedNotes(this.arrayNotes, 'unit_notes', this.activeUnit.unit_id);
            }
            if (this.activeUnit !== undefined) {
              this.getClassFromUnit(this.activeUnit, this.subject);
              this.getTextBooks(this.activeUnit.unit_id)
            }
            // this.units = this.sortUnits(this.units);
          } else {
            this.units = [];
          }
        })
    this.isShowDetails = !this.isShowDetails;
    this.enabledListForum = [];
  }

  /**
   * Muestra las unidades de la materia
   * @param index
   */
  getUnit(index) {
    this.activeUnit = this.units[index];
    this.arrayNotes = this.units[index]['unit_notes'];
    this.viewedNotes(this.arrayNotes, 'unit_notes', this.activeUnit.unit_id);
    this.getClassFromUnit(this.activeUnit, this.subject);
    this.getTextBooks(this.activeUnit.unit_id)
  }

  /**
   * Muestra las clases de una unidad seleccionada.
   * @param activeUnit unidad seleccionada
   * @param subject matetia seleccionada
   */
  getClassFromUnit(activeUnit, subject) {
    this.studenSubjectService.getClassFromUnit(this.student.student_unit_educational, this.student.student_parallel_id,
        activeUnit, subject, this.periodAcademicStorage[0].academic_year_name).pipe(map((clase) => clase.filter(c => c.class_status === true)))
        .subscribe(clases => {
          if (clases !== undefined && clases.length !== 0) {
            this.class = this.sortClassList(clases as Classdocum);
            if (this.class[0].class_resources) {
              if (this.class['class_notes'] !== undefined) {
                this.classNotes = this.class['class_notes'];
                this.viewedNotes(this.classNotes, 'class_notes', this.class.class_id)
              }
            }
            this.getStudentClass(activeUnit.unit_id);
            this.getResources(activeUnit.unit_id, this.class);
            this.forumEnabledList(this.class, activeUnit.unit_id)


          } else {
            this.class = [];
          }
        });
  }

  getStudentClass(unit_id) {
    this.studentClass = [];
    this.studenSubjectService.getStudenClass(this.student.student_id, this.subject.subject_id,
        unit_id).subscribe(studentclases => {
      this.studentClass = studentclases;
      this.validateInitilizedClass()
      // console.log(this.studentClass)
    })

  }

  public validateInitilizedClass() {
    this.class.forEach((classId: Classdocum) => {
      classId.class_status = null;
      classId.is_start = null;
      classId.class_status = null
      if (this.studentClass.length > 0) {
        this.studentClass.forEach(element => {
          if (element.class_id === classId.class_id) {
            if (element.status !== undefined) {
              classId.class_status = element.status;
            }
            if (element.status === undefined) {
              classId.class_status = null;
            }
          }
          if (element.class_id !== classId.class_id) {
            return;
          }
        });
      }
    });


  }

  /*validateStatusClass(classSelected: any) {
      console.log(classSelected)
      if (this.studentClass.length > 0) {
          for (const x of this.studentClass) {
              if (x.class_id === classSelected.class_id) {
                  console.log(x.status)
                  if (x.status) {
                      return classSelected.class_status = x.status;
                  }

              }
          }
      }
  }*/

  async getAllUnits() {
    let cont = 0;
    for (const element of this.arrayMaterias) {
      await this.studenSubjectService
          .getSubjectUnit(this.student.student_unit_educational, this.student.student_parallel_id, element.subject_id, this.periodAcademicStorage[0].academic_year_name)
          .subscribe(unit => {
            this.unidades.push(unit);
            if (this.unidades.length === this.arrayMaterias.length) {
              this.getAllClass();
              this.getWorkedClass();
            }
          });
      cont++;
    }
  }

  getAllClass() {
    // console.log('*** getAllClass ***');
    // console.log(this.unidades.length);
    if (this.unidades.length > 0) {
      this.unidades.forEach((elementUnit, i) => {
        elementUnit.forEach(async unit => {
          await this.studenSubjectService.getAllClassFromUnit(this.student.student_unit_educational,
              this.student.student_parallel_id, unit.subject, unit.unit_id, this.periodAcademicStorage[0].academic_year_name).subscribe(clase => {
            clase.forEach(clases => {
              if (clases.data().class_status) {
                this.arrayMaterias[i].sizeClase = true;
              }
            });
          })
        });
      });

      this.unidades.forEach((element, i) => {
        console.log(this.student.student_unit_educational,
            element.subject, element.unit_id);
        this.studenSubjectService.getAllStudenClass(this.student.student_unit_educational,
            element.subject, element.unit_id).subscribe(clase => {
          this.unidades[i].sizeClassStudent = clase.size;
          // console.log(this.unidades[i]);

        });
      });
    }
  }

  getWorkedClass() {
    console.log('*** Worked classes ***')
    this.arrayMaterias.forEach((subject, i) => {
      if (this.unidades.length > 0) {
        this.unidades.forEach((element) => {
          element.forEach((unit) => {
            if (unit.subject === subject.subject_id) {
              // console.log(subject.subject_name)
            }
            this.studenSubjectService.getClassFromUnit(this.student.student_unit_educational, this.student.student_parallel_id,
                unit, subject, this.periodAcademicStorage[0].academic_year_name).pipe(map((clase) => clase.filter(c => c.class_status === true))).subscribe(clases => {
              this.studenSubjectService.getStudenClass(this.student.student_id, subject.subject_id,
                  unit.unit_id).subscribe(studentclases => {
                if (clases.length > 0) {
                  if (clases.length > studentclases.length) {
                    this.pendingClassStatus[i] = true;
                  }
                }
              })
            })
          });
        });
      }
    })
  }

  callSwal() {
    swal({
      title: 'Clase finalizada',
      text: 'Para ver nuevamente los recursos haga click en cada uno de ellos!',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-fill btn-success',
      type: 'success',
    }).catch(swal.noop)
  }

  /**
   * revisa si el estudiante ha leido las notas de la clase
   * @param note array de notas.
   * @param note tipo de nota (clase/unidad) .
   */
  viewedNotes(note, note_type, id) {
    if (note_type === 'class_notes') {
      note.forEach(element => {
        this.studenSubjectService.checkViewedNotes(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id,
            id, element).subscribe(response => {
              if (response !== undefined) {

              } else {

              }
            }
        )
      });
    } else {
      note.forEach(async element => {
        await this.studenSubjectService.checkUnitViewedNotes(this.student.student_id, this.subject.subject_id, id,
            element).subscribe(response => {
              if (response !== undefined) {
                this.arrayNotes[0].status = true;

              } else {
                this.arrayNotes[0].status = false;

              }

            }
        )
      });
    }

  }

  /**
   * guarda las notas que ve el estudiante
   * @param id class_id/unit_id
   */
  updateViewedNotes(note, note_type, id) {
    if (note_type === 'class_notes') {
      this.studenSubjectService
          .checkViewedNotes(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id,
              id, note.note_title).subscribe(response => {
        if (response !== undefined && null) {

        } else {
          this.studenSubjectService
              .updateCheckViewedNotes(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id,
                  id, note).then(res => {

          });
        }
      });
    } else {
      this.studenSubjectService.checkUnitViewedNotes(this.student.student_id, this.subject.subject_id, id,
          note.note_title).subscribe(response => {
        if (response !== undefined && null) {

        } else {
          this.studenSubjectService.updateCheckUnitViewedNotes(this.student.student_id, this.subject.subject_id,
              id, note).then(res => {

          });
        }
      });
    }
  }

  /**
   * Obtiene los textos asignados a la materia.
   * @param subject_id
   * @param grade_id
   */
  getTextBooks(unitId: String) {
    this.studenSubjectService.getTextbook(this.student.student_unit_educational, this.student.student_parallel_id,
        this.subject.subject_id, unitId, this.periodAcademicStorage[0].academic_year_name).subscribe(textboks => {
      this.arrayText = textboks;
    });
  }

  /**
   * Visualiza en un modal el libro seleccionado.
   * @param textUrl url libro seleccionado
   */
  showTextBook(textUrl) {
    if (textUrl.indexOf('gs://dydactico.appspot') > -1) {
      const book = textUrl.split('com');
      const ref = this.storage.ref(book[1]);
      ref.getDownloadURL().subscribe(downloadURL => {
        const url = downloadURL;
        this.resourceUrl = this.sanitizerUrl(url);
      });
    } else {
      this.resourceUrl = this.sanitizerUrl(textUrl);
    }
  }

  showVideo(videourl: string) {
    // this.selectedVideo = video.subject_name + ' : ' + video.title;
    this.id = videourl.replace('https://youtu.be/', '');
    this.resourceUrl = this.sanitizerUrl(videourl);
  }

  /**
   * detiene el video al cerrar el modal.
   */
  stopVideos() {
    const videos = document.querySelectorAll('iframe');
    Array.prototype.forEach.call(videos, function (video) {
      const src = video.src;
      video.src = src;
    });
    this.stopVideo()
    this.saveResource();
  }

  /**
   * Omite la seguridad y confía en que el valor dado sea un URL
   * @param url direccion del recurso externo
   */
  sanitizerUrl(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Muestra las practicas asiganadas a una clase.
   */
  async getResources(unit_id, clase) {
    this.arrayPractices = [];
    this.arrayTexts = [];
    let practicesAux = [];
    this.practices = [];
    this.arrayVideos = []
    this.arrayResources = []
    this.arrayEssays = [];
    let arraypractica: any = [];
    this.itemsInTrue = []
    this.arraypercentage = []
    this.evaluation = []
    this.statusNotesFromClass = []
    for (const element of clase) {
      const index = clase.indexOf(element)
      this.itemsInTrue[index] = 0;
      this.studenSubjectService.getResources(this.student.student_unit_educational, this.student.student_parallel_id,
          this.subject.subject_id, unit_id, element.class_id, this.periodAcademicStorage[0].academic_year_name).subscribe(resourses => {
        practicesAux = [];
        resourses.forEach(elements => {
          // console.log(elements);

          if (elements['resource_type'] === 'practice') {
            this.arrayPractices.push(elements)
          }
          if (elements['resource_type'] === 'text') {
            this.arrayTexts.push(elements)
          }
          if (elements['resource_type'] === 'video') {
            this.arrayVideos.push(elements)
          }
          if (elements['resource_type'] === 'essay') {
            this.arrayEssays.push(elements)
          }
          arraypractica = elements
          this.studenSubjectService.checkReosurces(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, element.class_id, arraypractica.resource_id).subscribe(item => {
            if (item !== undefined) {
              elements['resource_status'] = item['resource_status'];
            }
            if (resourses.length !== undefined) {
              this.calculateResourcePercentage()
              this.calculatePorcentage();
              const prueba = this.itemsInTrue[index] / resourses.length
              this.arraypercentage[index] = Math.floor(prueba * 100)
            }
          });
          practicesAux.push(elements)
        });
        this.practices.push(practicesAux);
        // console.log(this.practices);

      });
      this.studenSubjectService.getEvaluation(this.student.student_unit_educational, this.student.student_parallel_id,
          this.subject.subject_id, unit_id, element.class_id, this.periodAcademicStorage[0].academic_year_name).subscribe(evaluations => {
        if (evaluations.length > 0) {
          const url = evaluations[0].evaluation_url.split('/');
          this.studenSubjectService.checkEvaluation(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, element.class_id).subscribe(evaluation => {
            evaluation.forEach((ev: any) => {
              if (ev.evaluationData[0].evaluation_id === url[2]) {
                evaluations[0].evaluation_status = ev.evaluationStatus;
              }
              if (ev.evaluationData[0].evaluation_id === url[2] && ev.evaluationStatus === undefined) {
                evaluations[0].evaluation_status = true;
              }
              //    })
            })
          })
        }
        this.evaluation.push(evaluations)
      })
      this.studenSubjectService.checkNotesClass(this.student.student_id, this.subject.subject_id,
          this.activeUnit.unit_id, element.class_id).subscribe((classItems: any) => {
        if (classItems[0] !== undefined) {
          if (classItems[0].class_notes_status === true) {
            this.statusNotesFromClass[index] = true;
          }
        }
      })
    }

  }

  public calculateResourcePercentage() {
    let countTextShow = 0;
    let countVideoShow = 0;
    let countPracticeShow = 0;
    this.practices.forEach(elements => {
      elements.forEach(element => {
        if (element.resource_type === 'text' && element.resource_status === true) {
          countTextShow++;
        }
        if (element.resource_type === 'practice' && element.resource_status === true) {
          countPracticeShow++;
        }

        if (element.resource_type === 'video' && element.resource_status === true) {
          countVideoShow++;
        }
      });
    });
    const texts = countTextShow / this.arrayTexts.length
    this.percentageText = Math.floor(texts * 100)
    const videos = countVideoShow / this.arrayVideos.length
    this.percentageVideos = Math.floor(videos * 100)
    const practices = countPracticeShow / this.arrayPractices.length
    this.percentagePractice = Math.floor(practices * 100)
  }

  public async calculatePorcentage() {
    let contClass = 0;
    this.itemsInTrue[contClass] = 0;
    this.practices.forEach(element => {
      this.itemsInTrue[contClass] = 0;
      if (element !== undefined) {
        element.forEach(elements => {
          if (elements.resource_status === true) {
            this.itemsInTrue[contClass] = this.itemsInTrue[contClass] + 1;
          }
        })
        contClass++;
      }
    });
  }

  estadisticas(practices) {
    let cont = 0;
    const counts: any = [];
    const total = practices.length;
    practices.forEach(element => {
      if (element.resource_status) {
        cont++
      }
    });
    if (cont !== 0) {
      const task = (cont * 100) / total;
      counts.push({total: total, progress: task})
    }
  }

  /**
   * Muestra las notas de cada unidad
   * @param index
   */
  showUnitNotes(index) {
    this.isEditResource = false;
    this.note_title = '';
    this.note_content = '';
    this.note_title = this.arrayNotes[index]['note_title'];
    this.note_content = this.arrayNotes[index]['note_content'];
    this.updateViewedNotes(this.arrayNotes[index], 'unit_notes', this.activeUnit.unit_id);
  }

  /**
   * Muestra las notas de cada unidad
   * @param index
   */
  async showClassNotes(notas, clase) {
    this.isEditResource = true
    this.classNotes = [];
    this.note_title = '';
    this.note_content = '';
    this.classNotes = notas;

    if (this.classNotes !== undefined) {
      this.classNotes.forEach(element => {
        this.updateViewedNotes(element, 'class_notes', clase.class_id);
      });
    }
  }

  public async setNotes(notes, classSelected, indexClass) {
    this.notesClassSelected = [];
    const indice = indexClass[0];
    const res = await this.studenSubjectService
        .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classSelected.class_id)
        .pipe(take(1)).toPromise()
    // console.log(res ,this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id,classSelected.class_id, true)
    if (res !== undefined) {
      await this.studenSubjectService
          .saveStatusNotesClass(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classSelected.class_id, true)
    }
    if (res === undefined) {
      await this.studenSubjectService
          .saveStatusNotesClass(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classSelected.class_id, false)
    }
    if (this.statusNotesFromClass[indice] === undefined) {
      this.studenSubjectService
          .updateViewedNotes(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classSelected.class_id);
    }
    notes.forEach(element => {

      this.notesClassSelected.push(element)
    });
  }

  async preOpenResource(clase?, indexClass?, isStart?) {
    this.isResourceVideo = false;
    this.isResourceText = false;
    this.isResourceFile = false;
    this.isResourceUrl = false;
    this.lastResource = false;
    this.isResourceUrlYoutube = false;
    this.indexClass = indexClass
    this.idIntent = new Date().getTime().toString();
    this.classSelected = clase[indexClass];
    let i = 0;
    if (isStart === true) {
      this.indexResource = 0;
    }
    if (this.practices[indexClass].length < 2) {
      this.lastResource = true;
    }
    this.practices[indexClass].forEach(element => {
      if (!element.resource_status) {
        this.onShow(this.practices[indexClass][i], true);
        this.resourcedocum.resource_status = false;
        this.resourcedocum.completed = false;
        return;
      }
      i++;
      this.indexResource = i;
    });
    this.saveClassWorked(this.classSelected, true, this.indexResource);
    // this.validateStatusClass(this.classSelected)
    /* if (this.indexResource === (this.practices[indexClass].length - 1) ) {
         this.lastResource = true;
         this.saveClassWorked(this.classSelected, false);
         this.updateStatusClass()
     } else { this.saveClassWorked(this.classSelected, true); }*/
  }

  async openResource(classItem, indexClass, indexResource) {
    this.indexClass = indexClass
    this.isResourceVideo = false;
    this.isResourceText = false;
    this.isResourceFile = false;
    this.isResourceUrl = false;
    this.isResourceUrlYoutube = false;
    this.indexResource = indexResource;
    this.idIntent = new Date().getTime().toString();
    this.classSelected = classItem;
    this.lastResource = true;
    this.resourcedocum.resource_status = true;
    this.resourcedocum.completed = true;
    this.onShow(this.practices[indexClass][indexResource]);

  }

  /**
   * Muestra las practicas de la clase segun su tipo.
   * @param resource
   */
  onShow(resource, isNextFromVideo?) {
    if (this.practices[this.indexClass]) {
      if (this.indexResource === (this.practices[this.indexClass].length - 1)) {
        this.lastResource = true;
      }
    }

    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', {timeZone: 'America/Guayaquil'}).split(' ');
    this.resourcedocum.resource_id = resource.resource_id;
    this.resourcedocum.class_id = this.classSelected.class_id;
    this.resourcedocum.startDate = init_date[0];
    this.resourcedocum.startTime = init_date[1];
    this.resourcedocum.resource_name = resource.resource_name;
    this.resourcedocum.resource_type = resource.resource_type;
    this.resourcedocum.intents = +1;


    if (isNextFromVideo === true) {
      this.resourcedocum.resource_status = false;
    }
    if (resource.resource_type !== 'essay' && resource.resource_type !== 'practice') {
      $('#exampleModalCenterVideo').modal('show')
    }
    if (resource.resource_type === 'url') {
      if (resource.resource_url.includes('youtube')) {
        this.isResourceUrlYoutube = true;
        this.idYoutube = resource.resource_url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1]
        this.resourceUrl = 'https://www.youtube.com/embed/' + this.idYoutube;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.resourceUrl);
      } else {
        this.isResourceUrl = true;
        this.OpenPopupCenter(resource.resource_url, ' ', 1000, 600);
      }
    }
    if (resource.resource_type === 'text') {
      this.showTextBook(resource.resource_url)
      this.isResourceText = true;
      //    $('#exampleModalCenterVideo').modal('show')
    }
    if (resource.resource_type === 'file') {
      this.showTextBook(resource.resource_url)
      this.isResourceFile = true
      //  $('#exampleModalCenterImport').modal('show')
    }
    if (resource.resource_type === 'video') {
      this.isResourceVideo = true;
      this.showVideo(resource.resource_url)

      // $('#exampleModalCenterVideo').modal('show')
    }
    if (resource.resource_type === 'essay') {
      const url = resource.resource_url.split('/');
      const essay_id = url[2];
      this.essayId = essay_id;
      this.showViewEssay = true;
      this.resourcedocum.resource_id_original = essay_id;

    }
    if (resource.resource_type === 'practice') {
      const url = resource.resource_url.split('es/');
      const practice_id = url[1];
      this.practiceId = practice_id
      $('#bd-content').addClass('modal-open');
      this.showViewPractice = true;
    }
    if (resource.resource_type !== 'essay') {
      this.saveResource(false);
    }

  }

  public performEvaluation(evaluation, classSelected, evaluationStatus) {
    this.classSelected = classSelected
    this.evaluationIDCreation = evaluation.evaluation_id;
    const url = evaluation.evaluation_url.split('/');
    this.evaluationSelect = evaluation;
    // console.log(classSelected)
    if (evaluationStatus) {
      swal({title: 'Ya haz realizado  esta  evaluación!'})
      return;
    } else {
      swal({
        title: '¿Confirma que desea iniciar la evaluación?',
        type: 'info',
        confirmButtonClass: 'btn btn-fill btn-primary btn-mr-5',
        cancelButtonClass: 'btn',
        confirmButtonText: 'Sí, iniciar!',
        cancelButtonText: 'No, Cancelar',
        showCancelButton: true,
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          this.startEvaluation = true;
          this.evaluationId = url[2];
          const res = await this.studenSubjectService
              .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classSelected.class_id)
              .pipe(take(1)).toPromise()
          // console.log(res)
          if (res !== undefined) {
            await this.studenSubjectService
                .saveStatusEvaluation(this.student.student_id, this.subject.subject_id,
                    this.activeUnit.unit_id, classSelected.class_id, true)
          }
          if (res === undefined) {
            await this.studenSubjectService
                .saveStatusEvaluation(this.student.student_id, this.subject.subject_id,
                    this.activeUnit.unit_id, classSelected.class_id, false)
          }
        }
      })
    }
  }

  /**
   * clambia el estado de la clase para indicar que se ha iniciado.
   *
   */
  updateStatusClass() {
    this.studenSubjectService.updateClass(this.student.student_unit_educational, this.student.student_parallel_id,
        this.activeUnit, this.subject, this.classSelected.class_id, this.periodAcademicStorage[0].academic_year_name).then(reponse => {
    });
  }

  /**
   * guarda el segumiento que se hace a una practica.
   */
  saveResource(isNext?) {
    if (this.resourcedocum.resource_type !== 'practice' && this.resourcedocum.resource_type !== 'video') {
      this.resourcedocum.resource_status = true;
    }
    this.resourcedocum.time_spend = this.calcTimeSpended();
    let val;
    this.studenSubjectService.entrySize(this.student.student_id, this.subject.subject_id,
        this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum).subscribe(querySnapshot => {
      val = querySnapshot.size;
      this.resourcedocum.intents = val;
    });
    if (this.resourcedocum.resource_type === 'video') {
      if (this.player !== undefined) {
        const time = parseInt(this.player.getDuration(), null);
        if (this.minSpend > time) {
          this.resourcedocum.completed = true;
          this.resourcedocum.resource_status = true
        } else {
          this.resourcedocum.completed = false;
        }
      }
    }
    this.studenSubjectService.saveResources(this.idIntent, this.student.student_id, this.subject.subject_id,
        this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum)
    if (this.practices[this.indexClass]) {
      if (this.indexResource + 1 === this.practices[this.indexClass].length && this.resourcedocum.resource_status === true) {
        this.lastResource = true;
        this.saveClassWorked(this.classSelected, false, this.indexResource)
        this.updateStatusClass()
      } else if (this.indexResource + 1 === this.practices[this.indexClass].length && this.resourcedocum.resource_status === false) {
        this.saveClassWorked(this.classSelected, true, this.indexResource)
      }
    }

    if (isNext === true) {
      if (this.resourcedocum.resource_type === 'video'
          && this.resourcedocum.completed === true
          && this.resourcedocum.resource_status === true) {
        this.isResourceVideo = false;
        this.isResourceText = false;
        this.isResourceFile = false;
        this.isResourceUrl = false;
        this.isResourceUrlYoutube = false;
        this.idIntent = new Date().getTime().toString();
        this.classSelected = this.class[this.indexClass];
        this.indexResource = this.indexResource + 1
        if (this.indexResource + 1 === this.practices[this.indexClass].length) {
          this.lastResource = true;
          this.saveClassWorked(this.classSelected, false, this.indexResource);
          this.updateStatusClass()
        }
        this.onShow(this.practices[this.indexClass][this.indexResource], true);
      } else {
        this.nextResource()
      }
    }
  }

  public nextResource() {
    this.isResourceVideo = false;
    this.isResourceText = false;
    this.isResourceFile = false;
    this.isResourceUrl = false;
    this.isResourceUrlYoutube = false;
    this.idIntent = new Date().getTime().toString();
    this.classSelected = this.class[this.indexClass];
    let i = 0;
    this.updateStatusClass();
    this.practices[this.indexClass].forEach(element => {
      if (element.resource_status === false) {
        this.onShow(this.practices[this.indexClass][i], true);
        return;
      }
      i++;
      //    console.log(i)
      /* if (i === (this.practices[this.indexClass].length - 1)) {
           this.lastResource = true;
           this.saveClassWorked(this.classSelected, false);
           //    this.updateStatusClass();
       }*/
      this.indexResource = i;
    });
  }

  public async saveClassWorked(classe, class_status, indexResource) {
    const res = await this.studenSubjectService
        .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classe.class_id)
        .pipe(take(1)).toPromise()
    // console.log(res)
    // console.log(classe.classId)
    if (res !== undefined) {
      await this.studenSubjectService
          .saveClassResource(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classe.class_id, class_status, true, indexResource)
    }
    if (res === undefined) {
      await this.studenSubjectService
          .saveClassResource(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classe.class_id, class_status, false, indexResource)
    }
  }

  /**
   * actualiza el recurso que ya ha sido trabajado.
   */
  updateResource() {
    this.isEditResource = false;
    this.studenSubjectService.saveResources(this.idIntent, this.student.student_id, this.subject.subject_id,
        this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum).then(response => {
    });
  }

  calcTimeSpended() {
    this.minSpend = 0;
    const fecha = new Date();
    const init_date = fecha.toLocaleString('es-ES', {timeZone: 'America/Guayaquil'}).split(' ');
    // const init_date1 = formatDate(fecha, 'dd-MM-yyyy', 'en-US', '+0530');
    const resource = this.classresource[0];
    this.resourcedocum.toDate = init_date[0];
    this.resourcedocum.toTime = init_date[1];
    const hoursEnd = this.resourcedocum.toTime.split(':')
    const hoursStar = this.resourcedocum.startTime.split(':')
    const hend = parseInt(hoursEnd[0], null);
    const mend = parseInt(hoursEnd[1], null);
    const send = parseInt(hoursEnd[2], null);
    const hstart = parseInt(hoursStar[0], null);
    const mstart = parseInt(hoursStar[1], null);
    const segstart = parseInt(hoursStar[2], null);
    let hora = (hend - hstart);
    let min = (mend - mstart);
    let seg = (send - segstart);
    if (hora < 0) {
      hora = hora * (-1)
    }
    if (min < 0) {
      min = min * (-1)
    }
    if (seg < 0) {
      seg = seg * (-1)
    }
    this.minSpend = (min * 60) + seg;
    const response = hora + 'h: ' + min + 'm: ' + seg + 's';
    return response
  }

  /** Cierra el modal de Practicas */
  public return() {
    $('#exampleModalCenterVideo').modal('hide')
    $('#bd-content').removeClass('modal-open')
    this.isResourceVideo = false;
    this.isResourceText = false;
    this.isResourceFile = false;
    this.isResourceUrl = false;
    this.lastResource = false;
    this.showViewPractice = false;
    this.showViewEssay = false;
    this.lastResource = false;
    this.isResourceUrlYoutube = false;
    if (this.resourcedocum.resource_type === 'practice' && this.resourcedocum.resource_status !== true) {
      this.resourcedocum.resource_status = false;
    }
    if (this.resourcedocum.resource_type !== 'essay') {
      this.saveResource();
    }
    // console.log(this.indexClass);
    // console.log(this.practices);
    // console.log(this.practices[this.indexClass]);
    if (this.resourcedocum.resource_type === 'essay'
        && this.indexResource + 1 === this.practices[this.indexClass].length
        && this.resourcedocum.resource_status === true) {
      this.saveClassWorked(this.classSelected, false, this.indexResource);
    }

  }

  public isReturnFinish() {
    $('#exampleModalCenterVideo').modal('hide')
    $('#bd-content').removeClass('modal-open')
    this.showViewPractice = false;
    this.resourcedocum.resource_status = true;
    this.saveResource()
  }

  public returnFromEvaluation() {
    this.startEvaluation = false;
    this.evaluationSelect.evaluation_status = true;
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

  }

  /**
   * Obtener la Lista de Foros para poder analizarlos mas adelante
   * @param classList
   * @param unitId
   * @private
   */
  private forumEnabledList(classList: [Classdocum], unitId: string) {
    for (const classObject of classList) {
      let forumDoc: ForumDocument;
      this.forumService
          .findForumClass(this.student.student_unit_educational, this.student.student_parallel_id,
              this.subject.subject_id, unitId, classObject.class_id)
          .subscribe(forum => {
            forumDoc = forum as ForumDocument
            const codeString = this.getCodeString(classObject.class_id, unitId);
            this.enabledListForum.push({codeStringState: codeString, resultForum: forumDoc, messages: 0})
            this.validateMessages(classObject.class_id, unitId);
          });
    }
  }

  public forumEnableValidation(classId: string, unitId: string): boolean {
    const codeString = this.getCodeString(classId, unitId);
    for (const forumE of this.enabledListForum) {
      if (codeString === forumE.codeStringState) {
        const forumDoc: ForumDocument = forumE.resultForum as ForumDocument;
        if (forumDoc !== undefined) {
          if (forumDoc.forum_status === false) {
            return false;
          } else {
            return true
            // return this.validateDateRange(forumDoc.forum_expiry_creation, forumDoc.forum_expiry_date);
          }
        } else {
          return false;
        }
      }
    }
  }

  private validateDateRange(creationDate: string, finishDate: string): boolean {
    const cDate = new Date(creationDate.replace(' ', 'T')).getTime();
    const fDate = new Date(finishDate.replace(' ', 'T')).getTime();
    const actualDate = new Date().getTime();
    return actualDate > cDate && actualDate < fDate;
  }

  /**
   * Visualizar el Foro
   */

  public async showDataForum(classId: string, unitId: string) {
    this.classIdSelected = classId;
    this.unitIdSelected = unitId;
    this.isShowForum = true;
    const res = await this.studenSubjectService
        .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classId)
        .pipe(take(1))
        .toPromise()
    if (res !== undefined) {
      await this.studenSubjectService
          .saveStatusForumClass(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classId, true)
    }
    if (res === undefined) {
      await this.studenSubjectService
          .saveStatusForumClass(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classId, false)
    }
    this.forumDocumentSelected = this.getForumObject(this.getCodeString(classId, unitId));
    this.forumService
        .getAllQuestionsForum(this.student.student_unit_educational, this.student.student_parallel_id,
            this.subject.subject_id, this.unitIdSelected, this.classIdSelected)
        .subscribe(questionList => {
          this.forumQuestionDocumentList = questionList as Array<ForumQuestionDTO>
          this.forumQuestionDocumentList = this.forumQuestionDocumentList.sort(function (a, b) {
            if (a.question_id > b.question_id) {
              return -1;
            }
            if (a.question_id < b.question_id) {
              return 1;
            }
            return 0;
          });
          for (const forumQuestion of this.forumQuestionDocumentList) {
            this.showAnswers(forumQuestion);
            if (!this.validateExistence(forumQuestion.question_id)) {
              forumQuestion.studentAnswersList.push(this.student.student_id);
              this.forumService.addView(this.student.student_unit_educational, this.student.student_parallel_id,
                  this.subject.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestion);
            }
          }
        });
  }

  private getForumObject(codeString: string): ForumDocument {
    for (const forumE of this.enabledListForum) {
      if (codeString === forumE.codeStringState) {
        return forumE.resultForum
      }
    }
    return null;
  }

  private getCodeString(classId: string, unitId: string) {
    return this.student.student_unit_educational
        + ';' + this.student.student_parallel_id
        + ';' + this.subject.subject_id
        + ';' + unitId
        + ';' + classId;
  }

  public hideDataForum() {
    this.isShowForum = false;
    this.classIdSelected = '';
    this.unitIdSelected = '';
  }

  getColor() {
    return 'rgb( 46, 116, 190 )';
  }

  public saveContribution(forumQuestionDocument: ForumQuestionDocument, index: number) {
    this.documentForumAnswerSave.answer_id = String(new Date().getTime().valueOf());
    this.documentForumAnswerSave.answer_user_id = this.student.student_id;
    this.documentForumAnswerSave.answer = $('#questionId' + index).val();
    this.documentForumAnswerSave.answer_user_name = this.student.student_name + ' ' + this.student.student_lastname;
    this.documentForumAnswerSave.answer_user_type = 'estudiante';
    this.documentForumAnswerSave.answer_status = true;
    this.documentForumAnswerSave.answer_count_like = [];
    this.forumService
        .saveContribution(this.student.student_unit_educational, this.student.student_parallel_id,
            this.subject.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument, this.documentForumAnswerSave);
    this.documentForumAnswerSave = new DocumentForumAnswer();
    $('#questionId' + index).val('');
  }

  public validateExistence(questionCOde: string): boolean {
    for (const x of this.forumQuestionDocumentList) {
      if (x.question_id === questionCOde) {
        return (x.studentAnswersList as string[]).indexOf(this.student.student_id) !== -1;
      }
    }
  }

  public showAnswers(forumQuestionDocument: ForumQuestionDocument) {
    this.documentForumAnswerList = [];
    this.documentForumBestAnswer = new DocumentForumAnswer();
    this.forumService
        .getAllAnswer(this.student.student_unit_educational, this.student.student_parallel_id,
            this.subject.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument)
        .subscribe(answersLIst => {
          let cont = 0;
          for (const forumQuestion of this.forumQuestionDocumentList) {
            if (forumQuestion.question_id === forumQuestionDocument.question_id) {
              this.forumQuestionDocumentList[cont].documentForumAnswerList = new Array<DocumentForumAnswer>();
              this.forumQuestionDocumentList[cont]
                  .documentForumAnswerList = this.sortList(answersLIst as Array<DocumentForumAnswer>);
              let maxSize = 0;
              this.forumQuestionDocumentList[cont].documentForumBestAnswer = new DocumentForumAnswer();
              for (const x of this.forumQuestionDocumentList[cont].documentForumAnswerList) {
                if (x.answer_count_like.length > maxSize) {
                  this.forumQuestionDocumentList[cont].documentForumBestAnswer = x;
                  maxSize = x.answer_count_like.length;
                }
              }
              break;
            }
            cont = cont + 1;
          }
        });
  }

  public likeAnswer(forumQuestionDocument: ForumQuestionDocument, documentForumAnswer: DocumentForumAnswer) {
    this.forumService
        .addLikeContribution(this.student.student_unit_educational, this.student.student_parallel_id,
            this.subject.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument,
            documentForumAnswer, this.student.student_id);
  }

  public getUserLikedAnswer(documentForumAnswerList: DocumentForumAnswer): boolean {
    return documentForumAnswerList.answer_count_like.indexOf(this.student.student_id) !== -1;
  }

  /**
   * METODOS PARA PODER GUARDAR Y CREAR UNA NUEVA PREGUNTA
   */
  public saveNewQuestion() {
    if (this.forumQuestionDocumentSave.question !== null) {
      const date = new Date();
      this.forumQuestionDocumentSave.question_id = new Date().getTime().toString();
      this.forumQuestionDocumentSave.id_user_creator = this.student.student_id;
      this.forumQuestionDocumentSave.question_date = this.getDate(date);
      this.forumQuestionDocumentSave.question_time = this.getTime(date);
      this.forumQuestionDocumentSave.user_type = 'estudiante';
      this.forumQuestionDocumentSave.question_status = true;
      this.forumQuestionDocumentSave.studentAnswersList = [];
      this.forumService.createForumQuestionStudent(this.student.student_unit_educational, this.student.student_parallel_id,
          this.subject.subject_id, this.unitIdSelected, this.classIdSelected, this.forumQuestionDocumentSave)
          .then(r => {
            this.forumQuestionDocumentSave = new ForumQuestionDocument()
          });
    }
  }

  private getDate(date: Date) {
    return date.getFullYear() + '/' + ((date.getMonth() + 1) > 12 ? 12 : (date.getMonth() + 1)) + '/' + date.getDate();
  }

  private getTime(date: Date) {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  private sortList(documentForumAnswerList: DocumentForumAnswer[]) {
    return documentForumAnswerList.sort(function (a, b) {
      if (a.answer_id > b.answer_id) {
        return -1;
      }
      if (a.answer_id < b.answer_id) {
        return 1;
      }
      return 0;
    });
  }

  public getDateAnswer(date: string) {
    const dat = new Date(Number(date));
    return this.getDate(dat) + ' - ' + this.getTime(dat)
  }

  /**
   * busca y retorna una lista ordenada segun el criterio de busqueda
   * @param question
   */
  searchQuestion(question: string) {
    if (question !== '') {
      this.forumService
          .getFilterQuestionsForum(this.student.student_unit_educational, this.student.student_parallel_id,
              this.subject.subject_id, this.unitIdSelected, this.classIdSelected, question)
          .subscribe(questionList => {
            this.forumQuestionDocumentList = questionList as Array<ForumQuestionDTO>;
            for (const forumQuestion of this.forumQuestionDocumentList) {
              this.showAnswers(forumQuestion);
            }
          });
    } else if (question === '') {
      this.showDataForum(this.classIdSelected, this.unitIdSelected);
    }
  }

  /*
   * Establecer un nuevo tiempo de espera para que se active en 600 ms
   */
  keyUpTimeout(question: string) {
    const timeoutFilter = 600;
    const contexto = this;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function () {
      contexto.searchQuestion(question);
    }, timeoutFilter);
  }

  private validateMessages(classId: string, unitId: string) {
    this.forumService
        .getAllQuestionsForum(this.student.student_unit_educational, this.student.student_parallel_id,
            this.subject.subject_id, unitId, classId)
        .subscribe(questionList => {
          let cont = 0
          for (const forumQuestion of questionList as Array<ForumQuestionDocument>) {
            if (forumQuestion.studentAnswersList.indexOf(this.student.student_id) === -1) {
              cont = cont + 1;
            }
          }
          let cont2 = 0
          for (const x of this.enabledListForum) {
            if (x.codeStringState === this.getCodeString(classId, unitId)) {
              this.enabledListForum[cont2].messages = cont;
            }
            cont2 = cont2 + 1;
          }
        });
  }

  public getMessagesNumber(classId: string, unitId: string): number {
    for (const x of this.enabledListForum) {
      if (x.codeStringState === this.getCodeString(classId, unitId)) {
        return x.messages;
      }
    }
    return 0;
  }

  public async setVideoConference(videoConference, classItem) {
    const res = await this.studenSubjectService
        .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classItem.class_id)
        .pipe(take(1))
        .toPromise()
    if (res !== undefined) {
      await this.studenSubjectService
          .saveStatusVideoConference(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classItem.class_id, true)
    }
    if (res === undefined) {
      await this.studenSubjectService
          .saveStatusVideoConference(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classItem.class_id, false)
    }
    this.videoConference = videoConference
  }

  public async setVideoClass(videClass, classItem) {
    console.log('estado del VIDEO')
    this.videoClass = videClass;
    const res = await this.studenSubjectService
        .getClassStatus(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, classItem.class_id)
        .pipe(take(1))
        .toPromise()
    if (res !== undefined) {
      await this.studenSubjectService
          .saveStatusVideoClass(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classItem.class_id, true)
    }
    if (res === undefined) {
      await this.studenSubjectService
          .saveStatusVideoClass(this.student.student_id, this.subject.subject_id,
              this.activeUnit.unit_id, classItem.class_id, false)
    }
    this.OpenPopupCenter(this.videoClass.urlVideoClass, 'TEST!?', 1000, 600);
  }

  OpenPopupCenter(pageURL, title, w, h) {
    //    console.log(pageURL);
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    const targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, ' +
        'menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  /**
   * alterna el color de las tarjetas del foro
   * @param index
   */
  getCardColor(index) {
    const position = index + 1;
    if (position % 2 === 0) {
      return '#EDFAFF';
    } else {
      return '#FFFFFF';
    }
  }

  /***
   * METODOS PARA PODER VALIDAR LOS ESTADOS
   * */
  public enableRepeatButton(resourceList: Array<Resource>): boolean {
    let repeatCont = 0;
    for (const resource of resourceList) {
      if (resource.resource_status === true) {
        repeatCont = repeatCont + 1;
      }
    }
    return repeatCont === resourceList.length;
  }

  public enableInitButton(resourceList: Array<Resource>): boolean {
    let startCont = 0;
    for (const resource of resourceList) {
      if (resource.resource_status === false) {
        startCont = startCont + 1;
      }
    }
    return startCont === resourceList.length;
  }

  public enableContinueButton(resourceList: Array<Resource>): boolean {
    return this.enableRepeatButton(resourceList) === this.enableInitButton(resourceList);
  }

  /**
   * METODOS PARA ORDENAR LAS LISTAS DE LOS USUARIOS
   * **/
  private sortClassList(classList: any): any {
    // console.log(classList)
    return classList.sort(function (a, b) {
      if (a.class_id > b.class_id) {
        return -1;
      }
      if (a.class_id < b.class_id) {
        return 1;
      }
      return 0;
    })
  }

  private sortUnits(units: any) {
    let cont = units.length;
    for (const unit of units.sort(function (a, b) {
      if (a.unit_id > b.unit_id) {
        return -1;
      }
      if (a.unit_id < b.unit_id) {
        return 1;
      }
      return 0;
    })) {
      unit.unitName = 'UNIDAD ' + cont + ' : ' + unit.unitName
      cont = cont - 1;
    }
    return units
  }

  public getUnitNumber(unitName: string): string {
    return unitName.split(':', 2)[0] as string
  }
}
