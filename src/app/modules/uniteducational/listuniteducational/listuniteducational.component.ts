import {Component, OnInit} from '@angular/core';

/**Models */
import {DataTable} from '../../../models/interfaces/data-table';
import {UnitEducational} from '../../../models/class/class.documentUnitEducational';
import {Level} from 'app/models/class/class.documentLevel';
import {SchoolGrade} from 'app/models/class/class.documentschoolGrade';
import {SubLevels} from 'app/models/class/class.documentSubLevels';
import {Parallels} from 'app/models/class/classdocument-parallels';
import {Academyareadocum} from 'app/models/academyarea/academyareadocum.model';
import {Subject} from 'app/models/class/classdocumentSubject'

/**Services */
import {StorageService} from 'app/services/storage/storage.service';
import {UnitEdicationalService} from '../../../services/unit-edicational/unit-edicational.service';
import {LevelsService} from 'app/services/levels/levels.service';
import {SubLevelsService} from '../../../services/sublevels/sublevels.service';
import {GradesService} from 'app/services/grades/grades.service';
import {ParallelsService} from 'app/services/parallels/parallels.service';
import {AcademyareaService} from 'app/services/academyarea/academyarea.service';
import {SubjectService} from 'app/services/subject/subject.service'
import {AuthService} from '../../../services/login/auth.service';
import DocumentData = firebase.firestore.DocumentData;
import {QuerySnapshot} from '@angular/fire/firestore';


declare var $: any;

@Component({
    selector: 'app-listuniteducational',
    templateUrl: './listuniteducational.component.html',
    styleUrls: ['./listuniteducational.component.css']
})
export class ListuniteducationalComponent implements OnInit {
    public unitEducational: UnitEducational;
    public dataTable: DataTable;
    public tablaunitEducationals;
    public isEdit: boolean = false;
    public listCountries = [];
    public listCities = [];
    public uniEducId: string;
    public loadedImage = false;
    public imageSrc: any;
    public imageFile: any;
    state_plain: boolean = true;

    /** DATOS DE ARRAYS PARA MOSTRAR */
    public arrayUnitEducational: UnitEducational[];
    public arrayLevels: Level[] = [];
    public arraySubLevels: SubLevels[] = [];
    public arrayLevelsAux: Level[];
    public arraySubLevelsAux: SubLevels[];
    public arrayGrades: SchoolGrade[];
    public arrayGradesAux: SchoolGrade[];
    public arrayParallels: Parallels[];
    public arrayParallelsAux: Parallels[];
    public arrayAcademy_area: Academyareadocum[];
    public arrayAcademy_areaAux: Academyareadocum[];
    public arraySubjects: Subject[];
    public arraySubjectsAux: Subject[];
    public academicPeriodStorage;

    constructor(
        public unitEdicationalService: UnitEdicationalService,
        private levelService: LevelsService,
        private sublevelService: SubLevelsService,
        private storageService: StorageService,
        private gradeService: GradesService,
        private parallelService: ParallelsService,
        private academyAreaService: AcademyareaService,
        private subjectService: SubjectService,
        public auth: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.arraySubLevels = [];
        this.arrayUnitEducational = [];
        this.getUnitEducational();
        this.academicPeriodStorage =  JSON.parse(localStorage.getItem('academic_period'));
        this.unitEducational = {
            unit_educational_id: new Date().getTime().toString(),
            unit_educational_name: '',
            unit_educational_address: '',
            unit_educational_phone: '',
            unit_educational_phoneBill:'',
            unit_educational_email: '',
            unit_educational_academy: '',
            unit_educational_country: '',
            unit_educational_city: '',
            unit_educational_logo: '',
            unit_educational_password: '',
            unit_educational_status: false,
        }

        this.tablaunitEducationals = $('#datatablesUnitEducational').DataTable({});
        this.dataTable = {
            headerRow: ['#', 'LOGO', 'NOMBRE', 'CÓDIGO', 'CONTRASEÑA', 'ESTADO', 'ACCIONES'],
            footerRow: ['#', 'LOGO', 'NOMBRE', 'CÓDIGO', 'CONTRASEÑA', 'ESTADO', 'ACCIONES'],
            dataRows: [[]]
        };
        this.getCountries();
        this.getCities();
        this.getDataLevel()
    }

    /**
     * Optenemos todas las unidades educativas
     */
    private getUnitEducational() {
        this.arrayUnitEducational = [];
        this.unitEdicationalService.allUnitEducationals()
            .then(doc => {
                if (!doc.empty) {
                    doc.forEach(ac => {
                        const unitEducational: UnitEducational = ac.data() as UnitEducational;
                        this.arrayUnitEducational.push(unitEducational)
                    });
                } else {
                    console.log('DATA UNIT EDUCATIONAL NOT FOUND')
                }
            })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS UNIT EDUCATIONAL:', error);
            });
    }

    /**
     * Limpiamos todo cuando se va a hacer un registro nuevo
     */
    public async addRegister() {
        this.isEdit = false;
        this.unitEducational = {
            unit_educational_id: new Date().getTime().toString(),
            unit_educational_name: '',
            unit_educational_address: '',
            unit_educational_phone: '',
            unit_educational_email: '',
            unit_educational_academy: '',
            unit_educational_phoneBill:'',
            unit_educational_country: '',
            unit_educational_city: '',
            unit_educational_logo: '',
            unit_educational_password: '',
            unit_educational_Confirmpassword: '',
            unit_educational_status: false,
        }
    }

    public passwordsMatch = (): boolean => {
        if (this.unitEducational.unit_educational_password === this.unitEducational.unit_educational_Confirmpassword) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Guardamos una nueva UE
     * @param unitEdicational
     * @param isValid
     */
    async save(unitEducational: UnitEducational, isValid: boolean) {
        if (isValid) {
            if (this.loadedImage) {
                unitEducational.unit_educational_logo = await this.storageService.uploadFile(`UnitEducational/${unitEducational.unit_educational_name}/logo_${unitEducational.unit_educational_id}.png`, this.imageFile);
            } else {
                unitEducational.unit_educational_logo = this.unitEducational.unit_educational_logo;
            }
            if (this.isEdit) {
                this.unitEdicationalService.saveUnitEducational(unitEducational, false);
                /// *** descomentar esta linea en caso de que no se creen los datos completos ***
                // this.saverLevelsUnitEducational(unitEducational);
            } else {
                await this.auth.registerUserAuth(unitEducational, true);
                await this.saverLevelsUnitEducational(unitEducational);
                // this.unitEdicationalService.saveUnitEducational(unitEducational, true)
            }
            $('#ModalRegister').modal('hide');
        } else {
            console.log('*** INVALIDO ***');
        }
    }

    /**
     * creamos los niveles en la UE
     * @param unitEdicational
     */
    async saverLevelsUnitEducational(unitEdicational) {
        await this.unitEdicationalService
            .saverLevelsUnitEducational(unitEdicational, this.arrayLevels, this.arraySubLevels, this.arrayGrades,
                this.arrayParallels, this.arrayAcademy_area, this.arraySubjects,
                this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Seleccionamos la UE que se desea editar
     * @param editUnitEducational
     */
    async editUnitEducational(editUnitEducational: UnitEducational) {
        this.isEdit = true;
        this.unitEducational = editUnitEducational;

        this.getLevelsUnitEducational().then(() => '');
        this.getSubLevelsUnitEducational().then(() => '');
        this.getGradesUnitEducational().then(() => '');
        this.getParallelsUnitEducational().then(() => '');
        this.getAcademyAreaUnitEducational().then(() => '');
        this.getSubjectsUnitEducational().then(() => '');
    }

    /**
     * Activamos - inactivamos la UE
     * esta funcion cambia el estado directamente el la DB
     * @param state
     */
    changeState(state) {
        this.unitEducational.unit_educational_status = state;
        this.unitEdicationalService.changeState(this.unitEducational, state);
    }

    /**
     * Obtenemos todos los niveles del sistema
     */
    private getDataLevel() {
        const dataLevel: Promise<QuerySnapshot<DocumentData>> = this.levelService.getAllLevels();
        dataLevel.then(doc => {
            if (!doc.empty) {
                doc.forEach(aux => {
                    this.arrayLevels.push(aux.data())
                });
                this.getDataSubLevel();
            } else {
                console.log('DATA ARRAY LEVELS NOT FOUND')
            }
        })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENT LEVELS:', error);
            });
    }

    /**
     * OBTENER LISTA DE GRADOS.
     */

    private getDataGrades() {
        this.arrayGrades = [];
        for (const subLevel of this.arraySubLevels) {
            const dataGrades: Promise<QuerySnapshot<DocumentData>> = this.gradeService
                .getAllGradesActiveNoRealTime(subLevel.level_id, subLevel.sublevel_id);
            dataGrades.then(doc => {
                if (!doc.empty) {
                    doc.forEach(aux => {
                        const grade: SchoolGrade = aux.data() as SchoolGrade;
                        grade.level_id = subLevel.level_id;
                        grade.level_name = subLevel.level_name;
                        grade.level_id = subLevel.level_id;
                        grade.sublevel_name = subLevel.sublevel_name;
                        if (!this.arrayGrades.find(data => data.grade_id === grade.grade_id)) {
                            this.arrayGrades.push(grade);
                        }
                    });
                } else {
                    console.log('DATA GRADES NOT FOUND')
                }
                this.getDataParallels();
            })
                .catch(function (error) {
                    console.log('ERROR GETTING DOCUMENTS GRADES:', error);
                });
        }
    }

    /**
     * OBTENER LISTA DE PARALELOS.
     */

    public getDataParallels() {
        this.arrayParallels = [];
        for (const grades of this.arrayGrades) {
            const dataParallels: Promise<QuerySnapshot<DocumentData>> = this.parallelService
                .getAllParallelsActiveNotRealTime(grades.level_id, grades.sublevel_id, grades.grade_id)
            dataParallels.then(doc => {
                if (!doc.empty) {
                    doc.forEach(aux => {
                        const parallel: Parallels = aux.data() as Parallels;
                        parallel.level_id = grades.level_id;
                        parallel.level_name = grades.level_name;
                        parallel.sublevel_id = grades.sublevel_id;
                        parallel.sublevel_name = grades.sublevel_name;
                        parallel.grade_id = grades.grade_id;
                        parallel.grade_name = grades.grade_name;
                        if (!this.arrayParallels.find(data => data.parallel_id === parallel.parallel_id)) {
                            this.arrayParallels.push(parallel);
                        }
                    });
                } else {
                    console.log('DATA PARALLELS NOT FOUND')
                }
            })
                .catch(function (error) {
                    console.log('ERROR GETTING DOCUMENTS PARALLELS:', error);
                });
        }
    }

    /**
     * OBTENER LISTA DE AREAS ACADEMICAS.
     */

    private getDataAcademyArea() {
        this.arrayAcademy_area = [];
        for (const arraySubLevel of this.arraySubLevels) {
            const dataAcademyArea: Promise<QuerySnapshot<DocumentData>> = this.academyAreaService
                .getAllAcademyAreaActivesNotRealTime(arraySubLevel.level_id, arraySubLevel.sublevel_id)
            dataAcademyArea.then(doc => {
                if (!doc.empty) {
                    doc.forEach(ac => {
                        const academyArea: Academyareadocum = ac.data() as Academyareadocum;
                        academyArea.level_name = arraySubLevel.level_name;
                        academyArea.sublevel_id = arraySubLevel.sublevel_id;
                        academyArea.sublevel_name = arraySubLevel.sublevel_name;
                        academyArea.level_id = arraySubLevel.level_id;
                        if (!this.arrayAcademy_area.find(data => data.academyarea_id === academyArea.academyarea_id)) {
                            this.arrayAcademy_area.push(academyArea);
                        }
                    });
                    this.getDataSubjects();
                } else {
                    console.log('DATA ACADEMY AREA NOT FOUND')
                }
            })
                .catch(function (error) {
                    console.log('ERROR GETTING DOCUMENTS PARALLELS:', error);
                });
        }
    }

    /**
     * OBTENER LISTA DE ASIGNATURAS.
     */

    private getDataSubjects() {
        this.arraySubjects = [];
        for (const academyArea of this.arrayAcademy_area) {
            const dataSubjects: Promise<QuerySnapshot<DocumentData>> = this.subjectService
                .getAllSubjectsActiveNotRealTime(academyArea.level_id, academyArea.sublevel_id, academyArea.academyarea_id);
            dataSubjects.then(doc => {
                if (!doc.empty) {
                    doc.forEach(ac => {
                        const subject: Subject = ac.data() as Subject;
                        subject.level_name = academyArea.level_name;
                        subject.sublevel_id = academyArea.sublevel_id;
                        subject.sublevel_name = academyArea.sublevel_name;
                        subject.level_id = academyArea.level_id;
                        if (!this.arraySubjects.find(data => data.subject_id === subject.subject_id)) {
                            this.arraySubjects.push(subject);
                        }
                    });
                } else {
                    console.log('DATA SUBJECT NOT FOUND')
                }
            })
                .catch(function (error) {
                    console.log('ERROR GETTING DOCUMENTS SUBJECT:', error);
                });
        }
    }


    /**
     * Obtenemos todos los niveles de la UE para determinar su estado
     */
    private async getLevelsUnitEducational() {
        this.arrayLevelsAux = [];
        const levelUnitEducational: Promise<QuerySnapshot<DocumentData>> = this.levelService
            .getLevelsUnitEducationalNotRealTime(this.unitEducational)
        levelUnitEducational.then(doc => {
            if (!doc.empty) {
                doc.forEach(lev => {
                    const level: Level = lev.data() as Level;
                    this.arrayLevelsAux.push(level);
                });
            } else {
                console.log('DATA UNIT LEVEL NOT FOUND')
            }
        })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS UNIT LEVEL:', error);
            });
    }


    /**
     * Obtenemos todos los niveles de la UE para determinar su estado
     */
    private async getSubLevelsUnitEducational() {
        this.arraySubLevelsAux = [];
        const unitEducationalSubLevel: Promise<QuerySnapshot<DocumentData>> = this.levelService
            .getSubLevelsUnitEducationalNotRealTime(this.unitEducational)
        unitEducationalSubLevel.then(doc => {
            if (!doc.empty) {
                doc.forEach(lev => {
                    const subLevels: SubLevels = lev.data() as SubLevels;
                    this.arraySubLevelsAux.push(subLevels);
                });
            } else {
                console.log('DATA UNIT SUBLEVEL NOT FOUND')
            }
        })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS UNIT SUBLEVEL:', error);
            });
    }

    /**
     * Obtenemos todos los grados de la UE para determinar su estado
     */
    private async getGradesUnitEducational() {
        this.arrayGradesAux = [];
        const gradesUnitEducational: Promise<QuerySnapshot<DocumentData>> = this.gradeService
            .getGradesUnitEducationalNotRealTime(this.unitEducational);
        gradesUnitEducational.then(doc => {
            if (!doc.empty) {
                doc.forEach(grad => {
                    const grades: SchoolGrade = grad.data() as SchoolGrade;
                    this.arrayGradesAux.push(grades);
                });
            } else {
                console.log('DATA UNIT GRADES UNIT EDUCATIONAL NOT FOUND')
            }
        })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS GRADES UNIT EDUCATIONAL:', error);
            });
    }

    /**
     * Obtenemos todos los paralelos de la UE para determinar su estado
     */
    private async getParallelsUnitEducational() {
        this.arrayParallelsAux = [];
        const response: Promise<QuerySnapshot<DocumentData>> = this.parallelService
            .getParallelsUnitEducationalNotRealTime(this.unitEducational);
        response.then(doc => {
            if (!doc.empty) {
                doc.forEach(grad => {
                    const parallel: Parallels = grad.data() as Parallels;
                    this.arrayParallelsAux.push(parallel);
                });
            } else {
                console.log('DATA PARALLELS UNIT EDUCATIONAL NOT FOUND')
            }
        })
            .catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS PARALLELS UNIT EDUCATIONAL:', error);
            });
    }

    /**
     * Obtenemos todos los paralelos de la UE para determinar su estado
     */
    private async getAcademyAreaUnitEducational() {
        this.arrayAcademy_areaAux = [];
        const response: Promise<QuerySnapshot<DocumentData>> = this.academyAreaService
            .getAcademyAreaUnitEducationalNotRealTime(this.unitEducational);
        response
            .then(doc => {
                if (!doc.empty) {
                    doc.forEach(academyA => {
                        const academyArea: Academyareadocum = academyA.data() as Academyareadocum;
                        this.arrayAcademy_areaAux.push(academyArea);
                    });
                } else {
                    console.log('DATA ACADEMY AREA UNIT EDUCATIONAL NOT FOUND');
                }
            }).catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS ACADEMY AREA UNIT EDUCATIONAL:', error);
            });
    }

    /**
     * Obtener asignaturas de la UE para determinar su estado.
     */
    private async getSubjectsUnitEducational() {
        this.arraySubjectsAux = [];
        for (const subjects of this.arraySubjects) {
            const response: Promise<QuerySnapshot<DocumentData>> = this.subjectService
                .getSubjectsUnitEducationalNotRealTime(this.unitEducational);
            response
                .then(doc => {
                    if (!doc.empty) {
                        doc.forEach(subj => {
                            const subject: Subject = subj.data() as Subject;
                            this.arraySubjectsAux.push(subject);
                        });
                    } else {
                        console.log('DATA SUBJECT UNIT EDUCATIONAL NOT FOUND');
                    }
                }).catch(function (error) {
                console.log('ERROR GETTING DOCUMENTS SUBJECT UNIT EDUCATIONAL:', error);
            });
        }
    }

    /**
     * Activamos - inactivamos el nivel dentro de la UE
     * esta funcion cambia el estado directamente el la DB
     * @param state
     * @param level
     */
    // async changeStateLevelUnitEducational(state, level: Level) {
    //     if (state === false) {
    //         console.log('ELIMINAR DATO DE LA LISTA');
    //     } else {
    //         console.log('AGREGAR DATO DE LA LISTA');
    //     }
    //     // await this.unitEdicationalService.changeStateLevelUnitEducational(this.unitEducational, level, state);
    // }

    public changeStateLevelUnitEducational(state: boolean, level: Level) {
        level.level_status = state;
        this.unitEdicationalService.changeStateLevelUnitEducational(this.unitEducational, level,
            this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Activamos - inactivamos el subnivel dentro de la UE
     * esta funcion cambia el estado directamente el la DB
     * @param state
     * @param subLevel
     */
    public changeStateSubLevelUnitEducational(state: boolean, subLevel: SubLevels) {
        subLevel.sublevel_status = state;
        this.unitEdicationalService.changeStateSubLevelUnitEducational(this.unitEducational, subLevel,
            this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Activamos - inactivamos el grado dentro de la UE
     * @param state
     * @param grade
     */
    public changeStateGradeUnitEducational(state: boolean, grade: SchoolGrade) {
        grade.grade_status = state;
        this.unitEdicationalService.changeStateGradeUnitEducational(this.unitEducational, grade,
            this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Activamos - inactivamos el paralelo dentro de la UE
     * @param state
     * @param parallel
     */
    public changeStateParallelUnitEducational(state: boolean, parallel: Parallels) {
        parallel.parallel_status = state;
        this.unitEdicationalService.changeStateParallelUnitEducational(this.unitEducational, parallel,
            this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Activamos - inactivamos el area academica dentro de la UE
     * @param state
     * @param academy_area
     */
    async changeStateAcademyAreaUnitEducational(state: boolean, academy_area: Academyareadocum) {
        academy_area.academyarea_state = state;
        this.unitEdicationalService.changeStateAcademyAreaUnitEducational(this.unitEducational, academy_area,
            this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Activamos - inactivamos el asignatura dentro de la UE
     * @param state
     * @param subject
     */
    public changeStateSubjectUnitEducational(state: boolean, subject: Subject) {
        subject.subject_status = state;
        const period = this.academicPeriodStorage[0].academicPeriodStorage;
        this.unitEdicationalService.changeStateSubjectUnitEducational(this.unitEducational, subject, this.academicPeriodStorage[0].academic_year_name);
    }

    /**
     * Obtenemos todos los Subniveles del sistema
     */
    private getDataSubLevel() {
        this.arraySubLevels = [];
        for (const level of this.arrayLevels) {
            const dataSubLevel: Promise<QuerySnapshot<DocumentData>> = this.sublevelService.getAllSubLevelsNoRealTime(level.level_id);
            dataSubLevel.then(doc => {
                if (!doc.empty) {
                    doc.forEach(aux => {
                        if (!this.arraySubLevels.find(data => data.sublevel_id === aux.data().sublevel_id)) {
                            const obj: SubLevels = aux.data() as SubLevels;
                            obj.level_name = level.level_name;
                            obj.level_id = level.level_id;
                            this.arraySubLevels.push(obj);
                        }
                        this.getDataGrades();
                        this.getDataAcademyArea();
                    });
                } else {
                    console.log('DATA ARRAY SUB LEVELS NOT FOUND')
                }
            })
                .catch(function (error) {
                    console.log('ERROR GETTING DOCUMENT SUB LEVELS:', error);
                });
        }
    }

    public clearUnitEducational() {
        this.isEdit = false;
    }

    initDataTable() {
        let aaa = this.tablaunitEducationals;
        $('#datatablesUnitEducational').DataTable().destroy();
        setTimeout(function () {
            aaa = $('#datatablesUnitEducational').DataTable({
                'dom': 'Bfrtip',
                'buttons': [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
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

    /**
     * OBTENER LISTADO DE PAISES.
     */
    public getCountries() {
        this.unitEdicationalService
            .getCountries()
            .subscribe(data => {
                this.listCountries = data
            })
    }

    /**
     * OBTENER LISTADO DE CIUDADES.
     */
    public getCities() {
        this.unitEdicationalService.getCities().subscribe(data => {
            this.listCities = data
        })
    }

    /**
     * EVENTO CARGA DE IMAGEN.
     * @param event.
     */
    public onChangeImage(event) {
        const files = event.srcElement.files;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imageSrc = e.target.result;
            };
            reader.readAsDataURL(files[0]);

        }
        this.upload(event)

    }

    public upload(event): void {
        const file = event.target.files[0];
        this.imageFile = file;
    }

    /**
     * Acciones a realizar en caso de seleccionar la imagen y cerrar la ventana antes de guardar.
     */
    public cancelFile() {
        this.imageSrc = null;
        this.imageFile = null;
        if (!this.isEdit) {
            this.unitEducational.unit_educational_logo = '';
        }

    }

    /**
     * EVENTOS PARA CAMBIAR ESTADO DE BOTONOS.
     */
    public saveFile() {
        this.loadedImage = true;
    }

    public addFile() {
        this.loadedImage = false;
    }

    /***
     * ENABLE DATA VALIDATION
     * **/

    public enableLevel(level: Level): boolean {
        return !!this.arrayLevelsAux.find(data => data.level_id === level.level_id);
    }

    public enableSubLevel(subLevel: SubLevels): boolean {
        return !!this.arraySubLevelsAux.find(data => data.sublevel_id === subLevel.sublevel_id);
    }

    public enableGrade(grade: SchoolGrade): boolean {
        return !!this.arrayGradesAux.find(data => data.grade_id === grade.grade_id);
    }

    public enableParallel(parallel: Parallels): boolean {
        return !!this.arrayParallelsAux.find(data => data.parallel_id === parallel.parallel_id);
    }

    public enableAcademyArea(academy_area: Academyareadocum): boolean  {
        return !!this.arrayAcademy_areaAux.find(data => data.academyarea_id === academy_area.academyarea_id);
    }

    public enableSubject(subject: Subject): boolean  {
        return !!this.arraySubjectsAux.find(data => data.subject_id === subject.subject_id);
    }
}
