import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTabGroup} from '@angular/material/tabs';
import {StudentService} from '../../../services/student/student.service';
import {Studentdocum} from '../../../models/class/class.documentstudent';
import swal from 'sweetalert2';
import {UnitEdicationalService} from '../../../services/unit-edicational/unit-edicational.service';
import {SchoolGrade} from 'app/models/class/class.documentschoolGrade';
import {RepresentativeService} from '../../../services/representative/representative.service';
import {RepresentedStudentdocum} from '../../../models/class/class.documentrepresentedstudent';
// import { ConsoleReporter } from 'jasmine';
import {Representativedocum} from '../../../models/class/class.documentRepresentative';
import {StudentSubjectsService} from 'app/services/student-subjects/student-subjects.service'
import {Student} from 'app/models/student/student.model';
import {Subject} from 'app/models/class/classdocumentSubject';
import {Resource} from '../../../models/dto/class.resource';
import {Entry} from '../../../models/dto/class.entry';
import {Notesdocum} from '../../../models/class/class.documentnote';
import {async} from '@angular/core/testing';
import {Adminpractices} from 'app/models/class/class.documentadminpractices';
import {map, take} from 'rxjs/operators';
import {TeacherSubjectsService} from 'app/services/teacher-subjects/teacher-subjects.service';
import {EvaluationSummary} from 'app/models/class/evaluation-summary';
import {InformationEvaluationQuestion} from 'app/models/class/class.document-informationPracticeQuestion';
import {AdminEvaluationService} from 'app/services/adminEvaluation/admin-evaluation.service';
import {AdminPracticeService} from 'app/services/adminPractice/admin-practice.service'
import {AuthService} from '../../../services/login/auth.service';
import {RegisterService} from '../../../services/register/register.service';

declare var $: any;

@Component({
    selector: 'app-representative-role',
    templateUrl: './representative-role.component.html',
    styleUrls: ['./representative-role.component.css']
})
export class RepresentativeRoleComponent implements OnInit {

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
    public infoUser: Representativedocum;
    // public StudentD: Studentdocum;

    arrayStudents = [];
    arrayMaterias = [];
    arrayDetail = [];
    dataSource = [];
    tabsunidades = [];
    tabsestudiantes = [];
    textInput: string = null;
    studentdocum: Studentdocum;
    gradedocum: SchoolGrade;
    representedStudent: RepresentedStudentdocum;
    asignstuden: RepresentedStudentdocum;
    showhome;
    showSubjects;
    showDetails;
    public itemsInTrue = [];
    public arraypercentage: Array<Number> = [];
    displayedColumns = ['Material', 'Completado', 'Duracion', 'Errores', 'Aciertos', 'FechaHora'];
    /* selected items */
    selected_student: Student = {};
    selected_subject: any = {};
    selected_unit: any = {};
    public tabIndexSelect;
    public notesClassSelected: any;
    public resourceList = [];
    public attemptDetailsList = []
    public arrayNotesFromUnit = []
    public studentSelect: Student;
    public StudentD: Studentdocum;
    public academicPeriodStorage;
    public evaluation: Array<Adminpractices[]> = [];
    public classSelected: String;
    public arrayQuestionsFromEvaluation: Array<InformationEvaluationQuestion>;

    constructor(private studentService: StudentService,
                private unitEdicationalService: UnitEdicationalService,
                private representativeService: RepresentativeService,
                private studentSubjectService: StudentSubjectsService,
                public teacherService: TeacherSubjectsService,
                public adminEvaluationService: AdminEvaluationService,
                public auth: AuthService,
                private registerService: RegisterService,
                public practicesService: AdminPracticeService) {
    }


    ngOnInit(): void {
        this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
        this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
        this.asignstuden = {
            student_id: '',
        }
        this.getrepresentedStudent();
        this.showhome = true;
        this.showSubjects = false;
        this.showDetails = false;

        this.StudentD = {
            student_id: '',
            student_identification: '',
            student_name: '',
            student_lastname: '',
            student_email: '',
            student_phone: '',
            student_movil: '',
            student_address: '',
            student_pass: '',
            student_status: false,
            student_level_id: '',
            student_sublevel_id: '',
            student_grade_id: '',
            student_parallel_id: '',
            student_representant: '',
        }

    }


    /* Set selected student */
    setSelectedStudent(event) {
        this.tabIndexSelect = event.index;
        this.selected_student = this.tabsestudiantes[event.index];
        localStorage.setItem('represented_student', JSON.stringify({student_id: this.selected_student.student_id}))
    }

    /* Set selected unit */
    async setSelectedUnit(event) {
        this.selected_unit = this.tabsunidades[event];
        this.itemsInTrue = []
        if (this.selected_unit !== undefined) {
            this.arrayNotesFromUnit = this.selected_unit.unit_notes
            this.getUnitClasses(this.selected_unit, 'setSelectedUnit_1');
        } else {
            this.selected_unit = this.tabsunidades[0];
            this.getUnitClasses(this.selected_unit, 'setSelectedUnit_2');
        }

    }

    setNotes(notes) {
        //  console.log(notes);
        this.notesClassSelected = notes;
    }

    getrepresentedStudent() {
        this.representativeService.getrepresentedstudent(this.infoUser.representative_id).subscribe(students => {
                if (students !== undefined && students.length !== 0) {
                    this.representedStudent = students[0];
                    this.tabsestudiantes = []
                    localStorage.setItem('represented_student', JSON.stringify(students[0]))
                    students.forEach(studentsrep => {
                        this.studentService.getstudent(studentsrep.student_id).subscribe(students => {
                            this.tabsestudiantes.push(students);
                            //        console.log(this.tabsestudiantes)
                            this.getSubject(students.student_unit_educational, students.student_grade_id, students);
                            // this.ejem(students.student_id);
                        })
                    })
                }
            }
        )
    }

    /**
     * Obtiene el estudiante y lo agrega al menu de navegacion
     * Get the student and add it to the navigation menu
     */
    addStudent() {
        this.studentService.getstudent(this.textInput.trim()).subscribe(students => {
            console.log(students);
            this.StudentD = students;
            // if (students !== undefined) {
            //     this.studentdocum = students;
            //     this.addRepresentedStuden(this.studentdocum, this.infoUser.representative_id);
            //     if (this.tabsestudiantes.find(data => data.student_id === this.studentdocum.student_id)) {
            //         swal({
            //             title: 'Error',
            //             text: 'El codigo del estudiante ingresado ya existe!',
            //             buttonsStyling: false,
            //             confirmButtonClass: 'btn btn-fill btn-danger',
            //             type: 'warning',
            //         }).catch(swal.noop)
            //     } else {
            //         this.arrayStudents.push(this.studentdocum.student_name);
            //         this.getSubject(this.studentdocum.student_unit_educational, this.studentdocum.student_grade_id, this.studentdocum.student_id);
            //         swal({
            //             title: 'Ok',
            //             text: 'El estudiante se ha agregado exitosamente!',
            //             buttonsStyling: false,
            //             confirmButtonClass: 'btn btn-fill btn-success',
            //             type: 'success',
            //         }).catch(swal.noop)
            //     }
            // } else {
            //     swal({
            //         title: 'Error',
            //         text: 'El codigo del estudiante ingresado no existe!',
            //         buttonsStyling: false,
            //         confirmButtonClass: 'btn btn-fill btn-danger',
            //         type: 'warning',
            //     }).catch(swal.noop)
            // }

        });
    }

    async saveStudent(students, isValid) {

        const data = await this.auth.findUserEmail(this.StudentD.student_email).pipe(take(1)).toPromise();
       if(data.length>0){

            if (isValid) {
                this.StudentD.student_representant = this.infoUser.representative_id;
                console.log(this.StudentD);

                if (students !== undefined) {
                    
                    this.studentdocum = students;
                    this.studentdocum.student_representant = this.infoUser.representative_id;

                    await this.addRepresentedStuden(this.studentdocum, this.infoUser.representative_id);
                    await this.registerService.update_student(this.StudentD); 

                    this.arrayStudents.push(this.studentdocum.student_name);
                    
                    await this.getSubject(this.studentdocum.student_unit_educational, this.studentdocum.student_grade_id, this.studentdocum.student_id);
                    swal({
                        title: 'Ok',
                        text: 'El estudiante se ha agregado exitosamente!',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-fill btn-success',
                        type: 'success',
                    }).catch(swal.noop)
                    this.StudentD = {};
                    this.textInput = '';

                } else {
                    swal({
                        title: 'Error',
                        text: 'El codigo del estudiante ingresado no existe!',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-fill btn-danger',
                        type: 'warning',
                    }).catch(swal.noop)
                }
            }
       }else{
        if (isValid) {
            this.StudentD.student_representant = this.infoUser.representative_id;
            console.log(this.StudentD);

            this.auth.SignUp(this.StudentD.student_email, this.StudentD.student_pass)
                .then((user) => {
                    const aux = {
                        ...user.user,
                        password: this.StudentD.student_pass,
                        identification: this.StudentD.student_identification,
                        role: '1595275706678',
                        user_type: 'estudiante'
                    }

                    this.auth.SetUserData(aux).then(() => {
                        this.registerService.update_student(this.StudentD).then(async () => {
                            if (students !== undefined) {
                                this.studentdocum = students;
                                await this.addRepresentedStuden(this.studentdocum, this.infoUser.representative_id);
                                if (this.tabsestudiantes.find(data => data.student_id === this.studentdocum.student_id)) {
                                    swal({
                                        title: 'Error',
                                        text: 'El codigo del estudiante ingresado ya existe!',
                                        buttonsStyling: false,
                                        confirmButtonClass: 'btn btn-fill btn-danger',
                                        type: 'warning',
                                    }).catch(swal.noop)
                                } else {
                                    this.arrayStudents.push(this.studentdocum.student_name);
                                    await this.getSubject(this.studentdocum.student_unit_educational, this.studentdocum.student_grade_id, this.studentdocum.student_id);
                                    swal({
                                        title: 'Ok',
                                        text: 'El estudiante se ha agregado exitosamente!',
                                        buttonsStyling: false,
                                        confirmButtonClass: 'btn btn-fill btn-success',
                                        type: 'success',
                                    }).catch(swal.noop)
                                    this.StudentD = {};
                                    this.textInput = '';
                                }
                            } else {
                                swal({
                                    title: 'Error',
                                    text: 'El codigo del estudiante ingresado no existe!',
                                    buttonsStyling: false,
                                    confirmButtonClass: 'btn btn-fill btn-danger',
                                    type: 'warning',
                                }).catch(swal.noop)
                            }
                        })
                    });
                }).catch(e => {
                this.auth.ManageErrors(e, this.StudentD.student_email);
            });
        }

       }

    

        

    }

    addRepresentedStuden(studentdocum: Studentdocum, representative_id: string) {
      
        this.asignstuden.student_id = studentdocum.student_id;
      
        this.representativeService.getrepresentedstudentById(representative_id, this.asignstuden.student_id)
            .subscribe(student => {
                console.log(student);
                if (student !== undefined) {

                } else {
                    this.representativeService.saverepresentedstudent(representative_id, this.asignstuden).then(() => '')
                }
            })
    }

    getSubject(student_unit_educational, student_grade_id, students) {
        const arrayMateriasAux = [];
        if (students.student_grade_id !== '') {
            this.unitEdicationalService.getGrades(student_unit_educational, students.student_grade_id, this.academicPeriodStorage[0].academic_year_name).subscribe(grade => {
                this.gradedocum = grade;
                if (this.gradedocum) {
                    this.unitEdicationalService
                        .getSubjectBySublevelId(student_unit_educational, this.gradedocum.sublevel_id, this.academicPeriodStorage[0].academic_year_name).subscribe(subjects => {
                        subjects.forEach(element => {
                            if (element.subject_status) {
                                arrayMateriasAux.push(element);
                            }
                        });
                    });
                    this.arrayMaterias.push(arrayMateriasAux);
                }
            })
        }
    }

    async getUnits() {
        this.tabsunidades = [];
        await this.unitEdicationalService
            .getSubjectUnits(this.selected_student, this.selected_subject, this.academicPeriodStorage[0].academic_year_name)
            .subscribe(units => {
                for (const aux of units as any) {
                    if (aux.statusUnit !== undefined) {
                        if (aux.statusUnit === true) {
                            this.tabsunidades.push(aux)
                        }
                    }
                }
                this.tabsunidades = this.sortUnits(this.tabsunidades);
                $('#salvacion0').click()
                // this.selected_unit = this.tabsunidades[0];
                this.setSelectedUnit(0)
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

    async getUnitClasses(selected_unit, donde) {
        // console.log('*** se llama en ***>>> ' + donde);

        this.selected_unit = selected_unit;
        this.itemsInTrue = []
        this.arraypercentage = []
        this.evaluation = []
        // console.log(this.selected_unit);

        await this.unitEdicationalService
            .getClassFromUnit(this.selected_student, this.selected_subject, this.selected_unit, this.academicPeriodStorage[0].academic_year_name)
            .pipe(map((clase) => clase.filter(c => c.class_status === true)))
            .subscribe(classes => {
                this.arrayDetail = this.sortClassList(classes);
                this.arrayDetail.forEach(unitClass => {
                    const index = this.arrayDetail.indexOf(unitClass)
                    this.itemsInTrue[index] = 0;
                    this.unitEdicationalService
                        .getClassResources(this.selected_student, this.selected_subject, this.selected_unit, unitClass, this.academicPeriodStorage[0].academic_year_name)
                        .subscribe(resources => {
                            // console.log('recursos de clase', resources);
                            resources.forEach(resource => {
                                this.studentSubjectService
                                    .checkReosurces(this.selected_student.student_id, this.selected_subject.subject_id,
                                        this.selected_unit.unit_id, unitClass.class_id, resource.resource_id).subscribe(item => {
                                    if (item !== undefined) {
                                        resource['resource_status'] = item['resource_status'];
                                    }
                                    if (resources.length !== undefined) {
                                        this.calculatePorcentage();
                                        const prueba = this.itemsInTrue[index] / resources.length
                                        this.arraypercentage[index] = Math.floor(prueba * 100)
                                    }
                                })
                                unitClass.resources = resources;
                            })
                        })
                    this.studentSubjectService
                        .getEvaluation(this.selected_student.student_unit_educational, this.selected_student.student_parallel_id, this.selected_subject.subject_id,
                        this.selected_unit.unit_id, unitClass.class_id, this.academicPeriodStorage[0].academic_year_name)
                        .subscribe(evaluations => {
                        // console.log(evaluations)
                        if (evaluations.length > 0) {
                            const url = evaluations[0].evaluation_url.split('/');
                            this.studentSubjectService.checkEvaluation(this.selected_student.student_id, this.selected_subject.subject_id,
                                this.selected_unit.unit_id, unitClass.class_id).subscribe(evaluation => {
                                // console.log(evaluation)
                                evaluation.forEach((ev: any) => {
                                    if (ev.evaluationData[0].evaluation_id === url[2]) {
                                        evaluations[0].evaluation_status = ev.evaluationStatus;
                                    }
                                    if (ev.evaluationData[0].evaluation_id === url[2] && ev.evaluationStatus === undefined) {
                                        evaluations[0].evaluation_status = true;
                                    }

                                })
                            })
                        }
                        this.evaluation.push(evaluations)
                    })
                })
            })
    }

    private sortClassList(classList: any): any {
        console.log(classList)
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

    getColor() {
        return 'rgb( 46, 116, 190 )';
    }


    async calculatePorcentage() {
        var contClass = 0;
        this.itemsInTrue[contClass] = 0;
        this.arrayDetail.forEach(element => {
            this.itemsInTrue[contClass] = 0;
            if (element.resources !== undefined) {
                element.resources.forEach(elements => {
                    if (elements.resource_status === true) {
                        this.itemsInTrue[contClass] = this.itemsInTrue[contClass] + 1;
                    }
                })
                contClass++;
            }
        });
    }

    async showSubject(item) {
        this.selected_subject = item;
        await this.getUnits();
        this.selected_unit = this.tabsunidades[0];
        this.itemsInTrue = []
        if (this.selected_unit !== undefined) {
            this.arrayNotesFromUnit = this.selected_unit.unit_notes
            await this.getUnitClasses(this.selected_unit, 'showSubject');
        }

        this.showhome = false;
        this.showSubjects = true;

    }

    hideSubject() {
        this.selected_subject = []
        this.showhome = true;

        this.tabGroup.selectedIndex = this.tabIndexSelect;
    }

    showDetail(item) {
        this.showSubjects = false;
        this.showDetails = true;
        this.findResources(item.class_id)
    }

    hideDetail() {
        this.showSubjects = true;
        this.showDetails = false;
        this.resourceList = [];
        this.attemptDetailsList = [];
    }

    private async findResources(classId: string) {
        this.classSelected = classId;
        const responseResources = await this
            .studentService
            .getClass(this.selected_student.student_id, this.selected_subject.subject_id, this.selected_unit.unit_id, classId);
        responseResources
            .subscribe(resourcesResponseList => {
                this.resourceList = resourcesResponseList as Array<Resource>
                this.teacherService.getStudentEvaluation(this.selected_student.student_id, this.selected_subject.subject_id, this.selected_unit.unit_id, classId).pipe(take(1)).subscribe((evaluations: EvaluationSummary[]) => {

                    if (evaluations[0] !== undefined) {
                        const indice = evaluations.length;
                        const lastAttemp = indice - 1;
                        evaluations[lastAttemp].intents = evaluations.length;
                        this.resourceList.push(evaluations[lastAttemp])
                    }
                })
                // console.log(this.resourceList)
            });
    }

    public async showTryDetail(resource: Resource) {
        //   console.log(resource)
        if (resource.evaluationData === undefined && resource.resource_type !== 'practice') {
            const responseEntry = await this
                .studentService
                .getEntry(this.selected_student.student_id, this.selected_subject.subject_id,
                    this.selected_unit.unit_id, resource.class_id, resource.resource_id);
            responseEntry
                .subscribe(entryResponseList => {
                    this.attemptDetailsList = entryResponseList as Array<Entry>
                    //  console.log(this.attemptDetailsList)

                });

        } else if (resource.evaluationData !== undefined && resource.resource_type !== 'practice') {
            // console.log(this.selected_student.student_id, this.selected_subject.subject_id,
            //    this.selected_unit.unit_id, this.classSelected)
            this.teacherService.getStudentEvaluation(this.selected_student.student_id, this.selected_subject.subject_id,
                this.selected_unit.unit_id, this.classSelected).subscribe((evaluation: any) => {
                //  console.log(evaluation)
                this.attemptDetailsList = evaluation;
            })
        } else if (resource.resource_type === 'practice') {
            this.showPractice(resource)
        }

    }

    public async showEvaluation(resource) {
        this.adminEvaluationService.getDetailsEvaluation(this.selected_student.student_id, this.selected_subject.subject_id,
            this.selected_unit.unit_id, this.classSelected, resource).subscribe(evaluation => {
            this.arrayQuestionsFromEvaluation = evaluation
        })
    }

    public async showPractice(resource: Resource) {
        this.studentService
            .getPracticeDetail(this.selected_student.student_id, this.selected_subject.subject_id,
                this.selected_unit.unit_id, resource.class_id, resource.resource_id).pipe(take(1))
            .subscribe(entryResponseList => {
                this.attemptDetailsList = entryResponseList
                this.attemptDetailsList.forEach(async data => {
                    this.studentService.getEntryAttemptDetail(this.selected_student.student_id, this.selected_subject.subject_id,
                        this.selected_unit.unit_id, resource.class_id, resource.resource_id, data.id, resource.resource_id).pipe(take(1)).subscribe(practice => {
                        if (practice.length > 0) {
                            this.studentService.getDetailEntry(this.selected_student.student_id, this.selected_subject.subject_id,
                                this.selected_unit.unit_id, resource.class_id, resource.resource_id, data.id, practice[0].id).pipe(take(1)).subscribe(attempts => {
                                const indice = this.attemptDetailsList.indexOf(data);
                                this.attemptDetailsList[indice].numberOfError = 0;
                                this.attemptDetailsList[indice].numberOfAttemps = 0
                                attempts.forEach(a => {
                                    this.attemptDetailsList[indice].numberOfError = parseInt(this.attemptDetailsList[indice].numberOfError.toString()) + parseInt(a.numberOfErrors.toString())
                                    this.attemptDetailsList[indice].numberOfAttemps = parseInt(this.attemptDetailsList[indice].numberOfAttemps.toString()) + parseInt(a.numberOfattempts.toString())
                                })
                            })
                        }
                    })
                })
            });
    }

}
