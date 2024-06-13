import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {TypePractice} from '../../../models/class/class.documenttype-practice';
import {AdminEssayService} from '../../../services/adminEssay/admin-essay.service';
import swal from 'sweetalert2';
import {take} from 'rxjs/operators';
import {Subject} from '../../../models/class/classdocumentSubject';
import {Rubric, RubricJudgement, RubricJudgementItem, RubricPoint} from '../../../models/class/class.documentrubric';
import {Student} from '../../../models/student/student.model';
import {Resourcesdocum} from '../../../models/class/class.documentresources';
import {StudentSubjectsService} from '../../../services/student-subjects/student-subjects.service';
import {StorageService} from '../../../services/storage/storage.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-do-student-essay',
    templateUrl: './do-student-essay.component.html',
    styleUrls: ['./do-student-essay.component.css']
})
export class DoStudentEssayComponent implements OnInit {

    @Input() essayId: String;
    @Input() student: Student;
    @Input() activeUnit: any;
    @Input() resourcedocum: Resourcesdocum;
    @Input() showViewEssay: Boolean;
    @Input() subject: Subject;
    @Output() isReturn = new EventEmitter();

    public essay: Adminpractices[];
    public essayName: string;
    public essayRubric: Rubric;
    public rubricJudgements: RubricJudgement[];
    public rubricPoints: RubricPoint[];
    public studentCalificationItems: RubricJudgementItem[];
    public allOptionsFromEssay: Array<TypePractice>;
    public count = 0;
    public isCorrect = false;
    public essayAnswer: {};
    public showRubric = false;
    public fileSrc: any;
    public fileFile: any;
    public idIntent = '';
    public total = 0;
    public resourcesUrl = [];
    files: File[] = [];

    constructor(public adminEssayService: AdminEssayService,
                public studentSubjectsService: StudentSubjectsService,
                public storageService: StorageService,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        this.essayRubric = {};
        console.log(this.essayId);
        // console.log(this.resourcedocum);

        if (this.essayId) {
            this.idIntent = new Date().getTime().toString();
            this.viewEssay(this.essayId);
            this.getStudentAnswer();
            this.getRubric();
            $('#ModalEssayDetail').modal('show')
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

    /* !Información de la actividad */

    public async getStudentAnswer() {
        this.adminEssayService.getStudentAnswer(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum.resource_id)
            .pipe(take(1)).toPromise()
            .then(resp => {
                if (resp.length > 0) {
                    this.essayAnswer = resp[0];
                    if (this.essayAnswer.hasOwnProperty('resource_url')) {
                        const auxURLS = this.essayAnswer['resource_url'];
                        auxURLS.forEach( url => {
                            this.resourcesUrl.push(this.sanitizerUrl(url))
                        })
                    }
                } else {
                    this.essayAnswer = {
                        resource_answer: '',
                        resource_save: false,
                        resource_comment: ''
                    };
                }
            });
    }

    private async getStudentCalification() {
        return this.adminEssayService.getStudentCalifications(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum.resource_id)
            .pipe(take(1)).toPromise();
    }

    /* Obtiene rubricas */
    public async getRubric() {
        this.adminEssayService.getRubric(this.essayId).subscribe(resp => {
            this.essayRubric = new Rubric(resp[0]);
            this.getRubricPoints(this.essayId, this.essayRubric);
            this.getStudentCalification().then((items: RubricJudgementItem[]) => {
                if (items.length > 0) {
                    this.studentCalificationItems = items;
                } else {
                    this.studentCalificationItems = [];
                }
                this.getRubricJudgements(this.essayId, this.essayRubric, this.studentCalificationItems);
            })
        })
    }

    private getRubricPoints(essay, rubric) {
        this.adminEssayService.getRubricPoints(essay, rubric).subscribe((resp: RubricPoint[]) => {
            this.rubricPoints = resp;
        })
    }

    private getRubricJudgements(essay, rubric, studentScoreList?: any) {
        this.total = 0;
        this.adminEssayService.getRubricJudgements(essay, rubric).subscribe((resp: RubricJudgement[]) => {
            this.rubricJudgements = resp;
            this.rubricJudgements.forEach(r => {
                this.adminEssayService.getRubricJudgementItems(essay, rubric, r).subscribe((items: RubricJudgementItem[]) => {
                    studentScoreList.forEach(score => {
                        let auxSum = 0;
                        items.some((it: any) => {
                            if (it.rubric_judgement_item_id === score.rubric_judgement_item_id) {
                                it.selected = true;
                                auxSum = +(it.rubric_judgement_item_calification)
                                this.total = this.total + auxSum;
                            }
                        })
                    })
                    r.rubric_judgement_items = items;
                });
            })
        })
    }

    /* !Obtiene rubricas */

    /** cerrar modal y retornar a componente padre */
    public closeModal() {
        this.isReturn.emit(true);
    }

    public onKey(e) {
        this.essayAnswer = e;
        if (e.length !== 0) {
            this.isCorrect = true;
        } else if (e.length === 0) {
            this.isCorrect = false;
        }
    }

    saveTempAnswer(answer: any) {
        this.studentSubjectsService
            .saveTempEstudentAnswer(this.student.student_id, this.subject.subject_id, this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum, answer);
    }

    public onChargeDocs(event) {
        const files = event.target.files;
        this.checkSize(files).then(() => {
            console.log(this.files)
        });
    }

    public async checkSize(filesReceived) {
        Object.keys(filesReceived).forEach( item => {
            const size = filesReceived[item].size / 1024 / 1024;
            if (size > 35) {
                swal({
                    title: 'Error',
                    text: 'El tamaño del archivo es superior al límite',
                    type: 'error'
                })
                return;
            } else {
                this.files.push(filesReceived[item])
            }
        })
    }

    public onChangeImage(event) {
        const file = event.srcElement.files;
        if (file && file.length > 0) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.fileSrc = e.target.result;
            }
            reader.readAsDataURL(file[0]);
            this.uploadImageOfQuestion(event);
        }
    }

    public async uploadImageOfQuestion(event) {
        const file = await event.target.files[0];
        const size = file.size / 1024 / 1024;
        if (size > 35) {
            swal({
                title: 'Error',
                text: 'El tamaño del archivo es superior al límite',
                type: 'error'
            })
            return;
        } else {
            this.fileFile = await file;
            this.fileSrc = ''
        }
    }

    saveResource() {
        this.resourcedocum.resource_status = true;
        this.resourcedocum.time_spend = this.calcTimeSpended();
        let val;
        this.studentSubjectsService.entrySize(this.student.student_id, this.subject.subject_id,
            this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum).subscribe(querySnapshot => {
            val = querySnapshot.size;
            this.resourcedocum.intents = val;
        });
        this.studentSubjectsService.saveResources(this.idIntent, this.student.student_id, this.subject.subject_id,
            this.activeUnit.unit_id, this.resourcedocum.class_id, this.resourcedocum).then(response => {
        });
    }

    calcTimeSpended() {
        const fecha = new Date();
        const init_date = fecha.toLocaleString('es-ES', {timeZone: 'America/Guayaquil'}).split(' ');
        // const init_date1 = formatDate(fecha, 'dd-MM-yyyy', 'en-US', '+0530');
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
        const response = hora + 'h: ' + min + 'm: ' + seg + 's';
        return response
    }

    public saveAnswer(answer: any) {
        swal({
            title: 'Seguro?',
            text: 'Una vez que envíe, no será posible editar el documento',
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar'
        }).then((result) => {
            if (result.value) {
                answer.resource_save = true;
                if (this.files.length > 0) {
                    swal({
                        title: 'Espere!',
                        html: 'Estamos almacenando el archivo',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            swal.showLoading();
                            let urls = [];
                            this.files.forEach( file => {
                                const fileSavePath: string =
                                    'activities/' + this.student.student_id +
                                    '/subject/' + this.subject.subject_id +
                                    '/' + this.activeUnit.unit_id +
                                    '/resource/' + this.resourcedocum.class_id +
                                    '/' + this.resourcedocum.resource_id + '/' + file.name;
                                console.log(fileSavePath)
                                this.storageService
                                    .uploadFileV2(fileSavePath, file)
                                    .then(a => {
                                        if (a.state === 'success') {
                                            a.ref
                                                .getDownloadURL()
                                                .then(value => {
                                                    urls.push(value as string);
                                                    answer.resource_url = urls;
                                                    const saveAnswer = this.studentSubjectsService.saveStudentAnswer(this.student.student_id,
                                                        this.subject.subject_id,
                                                        this.activeUnit.unit_id,
                                                        this.resourcedocum.class_id,
                                                        this.resourcedocum.resource_id, answer);
                                                    saveAnswer.then(() => {
                                                        swal({
                                                            title: 'OK',
                                                            text: 'SU TAREA HA SIDO ENTREGADA :D !!!!',
                                                            type: 'success'
                                                        }).then(() => {
                                                            this.saveResource();
                                                            $('#ModalEssayDetail').modal('hide');
                                                            swal.hideLoading();
                                                            this.closeModal();
                                                        })
                                                    }).catch(reason => {
                                                        console.log('ERROR ALMACENANDO REGISTRO DE TAREA !!!', reason);
                                                        swal({
                                                            title: 'ERROR !!!! 10003',
                                                            text: 'ERROR AL REGISTRAR SU TAREA !!!',
                                                            type: 'error'
                                                        }).then(() => {
                                                            this.saveResource();
                                                            $('#ModalEssayDetail').modal('hide');
                                                            swal.hideLoading();
                                                            this.closeModal();
                                                        })
                                                    });
                                                });
                                        } else {
                                            swal({
                                                title: 'ERROR !!!! 10002',
                                                text: 'ERROR AL INTENTAR CARGAR SU TAREA, INTENTELO NUEVAMENTE !!!!',
                                                type: 'error'
                                            }).then(() => {
                                                this.saveResource();
                                                $('#ModalEssayDetail').modal('hide');
                                                swal.hideLoading();
                                                this.closeModal();
                                            });
                                        }
                                    })
                                    .catch(reason => {
                                        console.log('ERROR AL CARGAR EL ARHIVO MULTIMEDIA !!!', reason);
                                        swal({
                                            title: 'ERROR, CODE 10001',
                                            text: 'ERROR AL INTENTAR CARGAR SU TAREA, INTENTELO NUEVAMENTE !!!!',
                                            type: 'error'
                                        }).then(() => {
                                            this.saveResource();
                                            $('#ModalEssayDetail').modal('hide');
                                            swal.hideLoading();
                                            this.closeModal();
                                        });
                                    })
                            })
                        }
                    }).then(() => this.files = [])
                } else {
                    const saveAnswer = this.studentSubjectsService.saveStudentAnswer(this.student.student_id,
                        this.subject.subject_id,
                        this.activeUnit.unit_id,
                        this.resourcedocum.class_id,
                        this.resourcedocum.resource_id, answer);
                    saveAnswer
                        .then(() => {
                            swal({
                                title: 'Ok!',
                                text: 'Documento guardado exitosamente',
                                type: 'success'
                            }).then(() => {
                                this.saveResource();
                                $('#ModalEssayDetail').modal('hide');
                                this.closeModal();
                            });
                        })
                        .catch(reason => {
                            console.log('ERROR AL CARGAR EL ARCHIVO !!! 100117', reason);
                            swal({
                                title: 'ERROR !!!!',
                                text: 'ERROR AL INTENTAR CARGAR SU TAREA, INTENTELO NUEVAMENTE !!!!',
                                type: 'error'
                            }).then(() => {
                                this.fileFile = '';
                                this.saveResource();
                                $('#ModalEssayDetail').modal('hide');
                                swal.hideLoading();
                                this.closeModal();
                            });
                        });
                }
            }
        });
    }

    /**
     * Omite la seguridad y confía en que el valor dado sea un URL
     * @param url direccion del recurso externo
     */
    sanitizerUrl(url): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
