import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {take} from 'rxjs/operators';
import {SubjectService} from '../../../services/subject/subject.service';
import {Subject} from 'app/models/class/classdocumentSubject';
import {Teacher} from '../../../models/teacher/teacher.model';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {TypePractice} from '../../../models/class/class.documenttype-practice';
import swal from 'sweetalert2';
import {Rubric, RubricJudgement, RubricPoint, RubricJudgementItem} from '../../../models/class/class.documentrubric';
import {AdminEssayService} from '../../../services/adminEssay/admin-essay.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from 'app/services/storage/storage.service';
import * as uuid from 'uuid';
declare var $: any;

@Component({
    selector: 'app-create-essay',
    templateUrl: './create-essay.component.html',
    styleUrls: ['./create-essay.component.css']
})
export class CreateEssayComponent implements OnInit {

    @Input() subjectId: String;
    @Input() gradeId: String;
    @Input() infoUser: Teacher;
    @Input() essayId: String;
    @Input() isNewActivity: Boolean
    @Output() isReturn = new EventEmitter();

    public essay: Adminpractices;
    public id_essay: String;
    public Subject: Subject;
    public arrayEssay: Adminpractices[];
    public optionQuestionSelect: TypePractice;
    public scoringArrayEvaluation: number[];
    public timeArray: Array<String>;
    public addOtherTime = false;
    public otherTime: number;
    public imageSrc: any;
    public imageFile: any;
    public showAlert = false;
    public isCorrect: boolean;
    public isRubricActive = false;
    public isRubricSave = false;
    public isOptionSave = false;
    // Rubricas
    public essayRubric: Rubric;
    public rubricJudgements: RubricJudgement[];
    public rubricPoints: RubricPoint[];
    public nameFile: String;
    public file: any;

    constructor(public subjectService: SubjectService,
                public adminEssayService: AdminEssayService,
                public fb: FormBuilder,
                private storageService: StorageService) {
    }

    ngOnInit(): void {
        if (this.subjectId) {
            this.getSubjectId();
        }
        if (!this.isNewActivity) {
            this.id_essay = this.essayId;
            this.isOptionSave = true;
            this.getEssay();
        } else {
            this.id_essay = ''
        }

        this.essay = {
            essay_name: '',
            essay_scoring: 0,
        };

        this.scoringArrayEvaluation = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.timeArray = ['15', '20', '60', 'Otro', 'Sin limite'];

        this.isCorrect = false;
    }

    public async getSubjectId() {
        this.Subject = await this.subjectService.getSubjectFromSubjectId(this.infoUser.teacher_unit_educational[0], this.subjectId)
            .pipe(take(1)).toPromise()
    }

    public addEssay() {
        if (this.id_essay === '') {
            this.id_essay = new Date().getTime().toString();
            const essay: Adminpractices = {
                'essay_id': this.id_essay,
                'essay_name': this.essay.essay_name,
                'grade_id': this.gradeId,
                'subject_id': this.subjectId,
                'public_status_practice_educational_unit': true,
                'public_status_practice': true,
                'teacher_id': this.infoUser.teacher_id,
                'unit_educational_id_from_teacher': this.infoUser.teacher_unit_educational[0],
                'essay_scoring': this.essay.essay_scoring,
                'test_type': 'essay'
            }
            this.adminEssayService.createEssay(essay);
            this.newRubric();
            this.getEssay();
        } else {
            const essayEdit: Adminpractices = {
                'essay_name': this.essay.essay_name
            }
            this.adminEssayService.updateEssay(this.id_essay, essayEdit);
        }
    }

    private newRubric() {
        this.essayRubric = new Rubric();
        this.isRubricSave = false;
        this.rubricJudgements = [];
        this.rubricJudgements.push(new RubricJudgement());
        this.rubricJudgements[0].rubric_judgement_items.push(new RubricJudgementItem());
        this.rubricPoints = [];
        this.rubricPoints.push(new RubricPoint());
    }

    public async getEssay() {
        this.arrayEssay = []
        this.arrayEssay = await this.adminEssayService.getEssay(this.id_essay).pipe(take(1)).toPromise();
        this.arrayEssay.map((essay) => this.essay = essay)
        this.getOptionsFromEssay(this.essay.essay_id).then(() => '');
    }

    public async getOptionsFromEssay(essay: String) {
        const resp = await this.adminEssayService.getOptionsFromEssay(essay).pipe(take(1)).toPromise();
        resp.forEach(item => {
            console.log(item);
            this.optionQuestionSelect = item;
            this.getRubric();
        })
    }

    public addEssayItem(typePracticeName = 'text') {
        const option_id = new Date().getTime().toString();
        const typePractice: TypePractice = {
            'option_id': option_id,
            'option_name': typePracticeName,
            'useCount': 0
        }
        this.adminEssayService.createOptionEssay(this.id_essay, typePractice, true);
        this.optionQuestionSelect = {
            option_name: typePracticeName,
            option_type: '',
            option_id: option_id,
            option_description: '',
        };

        this.getEssay()
    }

    addRubricJudgement() {
        const item = new RubricJudgement();
        item.rubric_judgement_items = [];
        let cont = 0;
        this.rubricPoints.forEach(p => {
            const rp = new RubricJudgementItem();
            rp.rubric_judgement_item_id = new Date().getTime().toString() + cont;
            rp.rubric_judgement_item_calification = p.rubric_point_calification;
            item.rubric_judgement_items.push(rp);
            cont++;
        })
        this.rubricJudgements.push(item);
        console.log(this.rubricJudgements);

        this.checkPoints();

    }

    deleteRubricJudgement() {
        swal({
            title: 'Desea eliminar la última file?',
            text: '',
            type: 'info',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
            cancelButtonClass: 'btn btn-fill btn-danger',
            confirmButtonText: 'Sí, eliminar!',
            buttonsStyling: false,
        }).then((result) => {
            if (result.value) {
                this.rubricJudgements.pop();
            }
        })
    }

    addRubricPoints() {
        console.log(this.rubricJudgements);
        const point = new RubricPoint();
        this.rubricPoints.push(point);
        this.rubricJudgements
            .forEach(r => {
            const rp = new RubricJudgementItem();
            r.rubric_judgement_items.push(rp);
        })
        this.checkPoints();
    }

    deleteRubricPoints() {
        swal({
            title: 'Desea eliminar la última columna?',
            text: '',
            type: 'info',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
            cancelButtonClass: 'btn btn-fill btn-danger',
            confirmButtonText: 'Sí, eliminar!',
            buttonsStyling: false,
        }).then((result) => {
            if (result.value) {
                this.rubricPoints.pop();
                this.rubricJudgements.forEach(r => {
                    r.rubric_judgement_items.pop();
                })
                this.checkPoints();
            }
        })
    }

    assignPoint(index, event) {
        console.log(this.rubricJudgements);
        this.rubricJudgements.forEach(it => {
            it.rubric_judgement_items[index].rubric_judgement_item_calification = parseFloat(event.target.value);
        })
    }

    checkPoints() {
        let mayor = 0;
        this.rubricPoints.forEach(r => {
            if (parseFloat(String(r.rubric_point_calification)) > mayor) {
                mayor = parseFloat(String(r.rubric_point_calification));
            }
        })
        this.isCorrect = (mayor * this.rubricJudgements.length) === this.essayRubric.rubric_calification;
    }

    saveRubric() {
        if (!this.isRubricSave) {
            if (this.essayRubric.rubric_id === '') {
                this.essayRubric.rubric_id = new Date().getTime().toString();
            }
        }
        for (const rubricJudgementsAuxObj of this.rubricJudgements) {
            for (const x of rubricJudgementsAuxObj.rubric_judgement_items) {
                x.rubric_judgement_item_id = '' + uuid.v4();
                x.rubric_judgement_item_id = x.rubric_judgement_item_id.replace('-', '');
            }
        }
        this.adminEssayService
            .createRubricEssay(this.id_essay + '', this.essayRubric, this.rubricJudgements, this.rubricPoints, this.isRubricSave)
            .then(() => {
                swal({
                    title: 'Ok',
                    text: 'Se guardaron los cambios correctamente!',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-fill btn-success',
                    type: 'success'
                }).then(() => {
                    $('#ModalRubricas').modal('hide');
                    this.getRubric();
                    this.isRubricSave = true;
                    this.rubricJudgements = [];
                    this.rubricPoints = [];
                }).catch(swal.noop)
            });
    }

    public async getRubric() {
        /*console.log('*** buscando rubrica en *** ' + this.essay.essay_id);
        console.log(this.id_essay);*/
        this.essayRubric = {};
        this.adminEssayService.getRubric(this.id_essay).subscribe(resp => {
            if (resp.length > 0) {
                this.isRubricSave = true;
                this.isRubricActive = true;
            }

            this.essayRubric = new Rubric(resp[0]);
            this.getRubricPoints(this.id_essay, this.essayRubric);
            this.getRubricJudgements(this.id_essay, this.essayRubric);
        })
    }

    private getRubricPoints(essay, rubric) {
        this.adminEssayService.getRubricPoints(essay, rubric).subscribe((resp: RubricPoint[]) => {
            this.rubricPoints = resp;
            // console.log(JSON.stringify(this.rubricPoints, null, 3));

        })

    }

    private getRubricJudgements(essay, rubric) {
        this.adminEssayService.getRubricJudgements(essay, rubric).subscribe((resp: RubricJudgement[]) => {
            this.rubricJudgements = resp;
            this.rubricJudgements.forEach(r => {
                this.adminEssayService.getRubricJudgementItems(essay, rubric, r).subscribe((items: RubricJudgementItem[]) => {
                    r.rubric_judgement_items = items;
                    /*console.log('*** this.rubricJudgements ***');
                    console.log(JSON.stringify(this.rubricJudgements, null, 3));*/
                });
            })
        })
    }

    public editRubric() {
        console.log(this.essayRubric.rubric_id);
    }

    public onChangeTime(e) {
        if (e.target.value === 'Otro') {
            this.addOtherTime = true;
        }
        if (e.target.value !== 'Otro') {
            this.addOtherTime = false;
        }
    }

    public onKey(e) {
        if (e.target.value > 60) {
            swal({
                title: 'Error',
                text: 'Debe ingresar un valor numerico menor o igual a 60',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-fill btn-warning',
                type: 'warning'
            }).catch(swal.noop)
        }

    }


    /* Guarda la opción del actividad (Text abierto)*/
    async saveOptionItem(isNew) {
        console.log('Agrega nuevo')
        if (this.otherTime) {
            this.optionQuestionSelect.question_time = this.otherTime.toLocaleString();
        }
        if (this.imageFile && this.optionQuestionSelect.option_type !== 'application/pdf') {
            this.optionQuestionSelect.question_image = await this.storageService.uploadFile(`essays/essay_${this.id_essay}/question_${this.optionQuestionSelect.option_id}/img_${this.optionQuestionSelect.option_id}.png`, this.imageFile);
        }
        if (this.file && this.optionQuestionSelect.option_type === 'application/pdf') {
            this.optionQuestionSelect.question_image = await this.storageService.uploadFile(`essays/essay_${this.id_essay}/question_${this.optionQuestionSelect.option_id}/file_${this.optionQuestionSelect.option_id}.pdf`, this.file);
        }
        this.optionQuestionSelect.question_scoring = this.essayRubric.rubric_calification
        this.adminEssayService.createQuestionEssay(this.id_essay, this.optionQuestionSelect, isNew)
            .then(() => {
                swal({
                    title: 'Ok',
                    text: 'Se guardaron los cambios correctamente!',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-fill btn-success',
                    type: 'success'
                }).then(() => {
                    this.isOptionSave = true;
                    $('#ModalAddEssayItem').modal('hide');
                })
            });
    }

    public deleteOption(opt) {
        swal({
            title: 'Desea eliminar este item?',
            text: '',
            type: 'info',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
            cancelButtonClass: 'btn btn-fill btn-danger',
            confirmButtonText: 'Sí, eliminar!',
            buttonsStyling: false,
        }).then((result) => {
            if (result.value) {
                this.adminEssayService.deleteOptionFromEssay(this.id_essay, opt, this.essayRubric);
                this.optionQuestionSelect = null;
                this.newRubric();
                this.isOptionSave = false;
                this.cleanFiles()
                swal({
                    title: 'Ok',
                    text: 'Opción eliminada!',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-fill btn-success',
                    type: 'success'
                }).catch(swal.noop)
            }
        })
    }

    public onChangeImage(event, isImageQuestion: boolean, opt?: any) {
        if (this.imageFile !== undefined && !isImageQuestion || this.file !== undefined && isImageQuestion) {
            swal({
                title: 'Error',
                text: 'Solo puede adjuntar un archivo a la actividad , debe borrar el archivo cargado para poder adjuntar uno nuevo.',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-fill btn-warning',
                type: 'warning'
            }).catch(swal.noop)
            event.target.value = ''
            return;
        } else {
            if (event.srcElement.files[0] !== undefined) {
                this.optionQuestionSelect.option_type = event.srcElement.files[0].type;
            }
            if (event.srcElement.files[0].type === 'application/pdf') {
                this.imageSrc = undefined;
                this.imageFile = undefined;
                this.nameFile = event.srcElement.files[0].name
                this.file = event.srcElement.files[0]
            } else {
                this.nameFile = ''
                if (isImageQuestion) {
                    this.file = undefined;
                    this.nameFile = undefined;
                    const file = event.srcElement.files;
                    if (file && file.length > 0) {
                        const reader = new FileReader();
                        reader.onload = (e: any) => {
                            this.imageSrc = e.target.result;
                        }
                        reader.readAsDataURL(file[0]);
                        this.uploadImageOfQuestion(event)
                    }
                } else {
                    const files = event.srcElement.files;
                    if (files && files.length > 0) {
                        const reader = new FileReader();
                        reader.onload = (e: any) => {
                            // this.arrayImagesOptions[opt] = e.target.result
                        }
                        reader.readAsDataURL(files[0]);
                        this.upload(event, opt).then(() => '');
                    }
                }
            }
        }
    }

    public cleanFiles() {
        this.imageSrc = undefined;
        this.imageFile = undefined;
        this.nameFile = undefined;
        this.file = undefined;
        $('#fileuploadIMG').val(null);
        $('#fileuploadPDF').val(null);
    }

    public async uploadImageOfQuestion(event) {
        const file = await event.target.files[0];
        this.imageFile = await file;
        this.imageSrc = ''
    }

    private async upload(event, optIndex?) {
        const files = await event.target.files[0];
    }

    public returnShowPracticesList() {
        this.isReturn.emit(true);
    }

    public validar() {
        this.showAlert = true;
    }

    public close() {

    }

    enableRemoveRubric() {
        if (this.optionQuestionSelect.useCount === undefined) {
            return false;
        } else {
            return this.optionQuestionSelect.useCount === 0;
        }
    }
}
