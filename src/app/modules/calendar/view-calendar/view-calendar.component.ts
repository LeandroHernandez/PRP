import {Component, ViewChild} from '@angular/core';
import {CalendarOptions, FullCalendarComponent} from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import {Subject} from '../../../models/class/classdocumentSubject';
import {Studentdocum} from '../../../models/class/class.documentstudent';
import {StudentService} from '../../../services/student/student.service';
import {UnitEdicationalService} from '../../../services/unit-edicational/unit-edicational.service';
import {StudentSubjectsService} from '../../../services/student-subjects/student-subjects.service';
import {SchoolGrade} from '../../../models/class/class.documentschoolGrade';
import {ViewCalendarService} from '../../../services/calendar/view-calendar.service';
import swal from 'sweetalert2';
// import swal2 from 'sweetalert2'


declare var $;

@Component({
    selector: 'app-view-calendar',
    templateUrl: './view-calendar.component.html',
    styleUrls: ['./view-calendar.component.css']
})

export class ViewCalendarComponent {

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    public events: any[] = [];
    public arrayMaterias: Subject[] = [];
    public infoUser: Studentdocum;
    public student: Studentdocum;
    public gradedocum: SchoolGrade;
    public unidades = [];
    public eventos = [];
    public pendingClassStatus: Array<boolean> = [];
    /* prueba */
    public clases = [];
    public loading: boolean;
    public hasClasses: boolean;

    public selectedEvent;
    public academicPeriodStorage;

    calendarOptions: CalendarOptions = {
        locale: esLocale,
        progressiveEventRendering: true,
        initialView: 'dayGridMonth',
        // initialView: 'dayGridWeek',
        eventClick: this.handleDateClick.bind(this), // bind is important!
        themeSystem: 'bootstrap',
        eventDisplay: 'block',
        eventContent: this.renderEventContent,
        headerToolbar: {
            right: 'prev,next'
        },
        events: this.eventos
    };

    constructor(private studentService: StudentService,
                private unitEdicationalService: UnitEdicationalService,
                private studenSubjectService: StudentSubjectsService,
                private wcS: ViewCalendarService) {
        this.student = JSON.parse(localStorage.getItem('infoUser'));
        this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
        this.loading = true;
        this.hasClasses = false;

        try {
            this.getEvents().then(() => {
                swal({
                    title: 'Espere',
                    text: 'Cargando Actividades del Estudiante',
                    confirmButtonClass: 'btn btn-fill btn-danger',
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    type: 'warning',

                    onBeforeOpen: () => {
                        // swal.showLoading();
                        swal.close();
                        this.loading = false;
                    }
                })
            })
                .catch(error => {
                    this.fun();
                })

        } catch (error) {
          console.log(error);

        }
    }

    renderEventContent(eventInfo, createElement) {

        let innerHtml;
        // Check if event has image
        if (eventInfo.event._def.extendedProps.imageUrl) {

            // Store custom html code in variable
            innerHtml = `<span><img style="width: 20px" src=${eventInfo.event._def.extendedProps.imageUrl} /> ${eventInfo.event._def.title}</span>`;
            // innerHtml = eventInfo.event._def.title + '<img style=\'width:20px;\' src=\'' + eventInfo.event._def.extendedProps.imageUrl + '\'>';
            // Event with rendering html
            return createElement = {html: '<div>' + innerHtml + '</div>'}
        }

    }

    async getEvents() {
        this.student = await this.getStudent();
        const allMaterias = await this.getAllSubjects(this.student.student_unit_educational, this.student.student_grade_id);
        this.unidades = await this.getAllUnits(allMaterias);
        allMaterias.forEach(materia => {
            const index = this.findInArray(materia);
            if (index) {
                this.arrayMaterias.push(materia)
            }
        })
        this.clases = await this.getAllClass();
        const studentClases = await this.getStudentClasses();
        for (const clase of this.clases) {
            for (const studentClase of studentClases) {
                if (clase.class_id === studentClase.class_id) {
                    const respStudentResource = await this.wcS.getStudentClassesResources(this.student.student_id, clase.subject, clase.unit_id, clase.class_id);
                    respStudentResource.docs.forEach(resource => {
                        for (let i = 0; i < clase.class_resources.length; i++) {
                            if (clase.class_resources[i].resource_id === resource.data()['resource_id']) {
                                clase.class_resources[i].resource_status = true
                            }
                        }
                    })
                    if (studentClase.evaluationClassStatus) {
                        clase.class_evaluation[0]['evaluation_status'] = true;
                    }
                }
            }
        }
        await this.getCalendarEvents();
    }

    /**
     * Busca en el array auxiliar para purgar las materias sin unidades
     * */
    private findInArray(materia) {
        return this.unidades.find(x => x.subject === materia.subject_id);
    }

    async getStudent() {
        const resp = await this.wcS.getStudent(this.student.student_id);
        return resp.docs[0].data();
    }

    /**
     * obtiene las materias segun el subnivel del estudiante.
     * @student_unit_educational
     * @student_grade_id
     */
    async getAllSubjects(student_unit_educational, student_grade_id) {
        const subjectR = [];
        const resp = await this.wcS.getGrades(student_unit_educational, student_grade_id, this.academicPeriodStorage[0].academic_year_name);
        this.gradedocum = resp.docs[0].data();
        const resp2 = await this.wcS.getSubjectBySublevelId(student_unit_educational, this.gradedocum.sublevel_id, this.academicPeriodStorage[0].academic_year_name);
        resp2.docs.forEach(r => {
            subjectR.push(r.data())
        })
        return subjectR;
    }

    async getAllUnits(allMaterias: Subject[]) {
        const units = [];
        for (const element of allMaterias) {
            const resp = await this.wcS.getSubjectUnit(this.student.student_unit_educational, this.student.student_parallel_id, element.subject_id, this.academicPeriodStorage[0].academic_year_name);
            resp.docs.forEach(r => {
                units.push(r.data())
            })
        }
        return units;
    }

    async getAllClass() {
        const clases = [];
        for (const unit of this.unidades) {
            const respUnit = await this.wcS.getAllClassFromUnit(this.student.student_unit_educational,
                this.student.student_parallel_id, unit.subject, unit.unit_id, this.academicPeriodStorage[0].academic_year_name);
            respUnit.docs.forEach(clase => {
                const claseData = {...unit, ...clase.data()};
                clases.push(claseData);
            });
        }
        return clases;
    }

    async getStudentClasses() {
        const studentClases = [];
        for (const unit of this.unidades) {
            const respStudentClasses = await this.wcS.getStudentClasses(this.student.student_id, unit.subject, unit.unit_id);
            respStudentClasses.docs.forEach(studentClass => {
                const studentData = {...unit, ...studentClass.data()};
                studentClases.push(studentData);
            })
        }
        return studentClases;
    }

    async getCalendarEvents() {
        this.clases.forEach(clase => {
            // Recursos
            if (clase.class_resources) {
                clase.class_resources.forEach(resource => {
                    let color;
                    let date;
                    if (resource.resource_status) {
                        color = '#59AA18';
                        date = clase.toDate + 'T01:00:00';
                    } else {
                        color = this.getEventColor(clase.subject);
                        date = clase.toDate;
                    }
                    const item = {
                        myId: JSON.stringify(resource),
                        title: `Actividad - ${resource.resource_name}`,
                        date,
                        color
                    }
                    this.eventos.push(item);
                });
            }
            // Evaluacion
            if (clase.class_evaluation) {
                if (clase.class_evaluation.length > 0) {
                    clase.class_evaluation.forEach(evaluation => {
                        let color = '#aa7018';
                        let date;
                        if (evaluation.evaluation_status) {
                            color = '#59AA18';
                            date = clase.toDate + 'T01:00:00';
                        } else {
                            color = this.getEventColor(clase.subject);
                            date = clase.toDate;
                        }
                        const evaluacion = {
                            myId: JSON.stringify(evaluation),
                            title: `Evaluación - ${evaluation.evaluation_name}`,
                            date,
                            color
                        }
                        this.eventos.push(evaluacion);
                    })
                }
            }
            // Link videoconferencia
            if (clase.hasOwnProperty('video_conference')) {
                const color = '#07d2c2';
                const video = {
                    myId: JSON.stringify(clase.video_conference),
                    title: `Videoconferencia: ${clase.video_conference.toHours}`,
                    date: clase.video_conference.toDate,
                    imageUrl: '../../../assets/img/icons/videocall.svg',
                    color
                }
                this.eventos.push(video)
            }
        })
        this.unidades.forEach(u => {
            if (u['video_conferences']) {
                u['video_conferences'].forEach(item => {
                    const color = '#07d2c2';
                    const video = {
                        myId: JSON.stringify(item),
                        title: `Videoconferencia: ${item.toHours}`,
                        date: item.toDate,
                        imageUrl: '../../../assets/img/icons/videocall.svg',
                        color
                    }
                    this.eventos.push(video)
                })
            }
        })
        this.eventos.length > 0 ? this.hasClasses = true : this.hasClasses = false;
    }

    /* Otorga color correspondiente a la materia */
    getEventColor(materia) {
        let color = '';
        this.arrayMaterias.forEach(mat => {
            if (mat.subject_id === materia) {
                if (mat.color === 'matOne') {
                    color = '#4c93ff'
                } else if (mat.color === 'matTwo') {
                    color = '#00ba56'
                } else if (mat.color === 'matThre') {
                    color = '#a64bff'
                } else if (mat.color === 'matFour') {
                    color = '#ff3370'
                } else if (mat.color === 'matFive') {
                    color = '#D48142'
                } else if (mat.color === 'matSix') {
                    color = '#E8BA4D'
                } else if (mat.color === 'matSeven') {
                    color = '#C54233'
                } else if (mat.color === 'matEight') {
                    color = '#3D96CD'
                } else if (mat.color === 'matNine') {
                    color = '#21F2F7'
                }
            }
        });
        return color;
    }


    handleDateClick(arg) {
        const dateClick = arg.event._def.extendedProps.myId;
        // console.log(JSON.parse(dateClick));
        this.selectedEvent = JSON.parse(dateClick);
        $('#modalCalendar').modal('show');
    }

    fun() {
        swal('EL ESTUDIANTE NO TIENE PENDIENTES', '', 'warning');
    }


}


