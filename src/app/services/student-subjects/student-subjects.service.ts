import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Studentdocum} from 'app/models/class/class.documentstudent';
import {catchError} from 'rxjs/operators';
import {InformationPracticeQuestion} from 'app/models/class/class.document-informationPracticeQuestion'
import {Adminpractices} from 'app/models/class/class.documentadminpractices';


@Injectable({
    providedIn: 'root'
})
export class StudentSubjectsService {
    constructor(public afs: AngularFirestore) {
    }

    /* get Units planned
     **
     * */
    getSubjectUnit(student_unit_educational, parallel_id, subject_id, period) {
        return this.afs.collection(`/cuenca/${student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units`, ref => ref.orderBy('unit_id', 'desc')).valueChanges();
    }

    /* get Class planned in a unit
     *
     * */
    getSubjectClass(student_unit_educational, parallel_id, subject_id, class_id, period) {
        return this.afs.collection(`/cuenca/${student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units/${class_id}/classes`).valueChanges();
    }

    /**
     * Get Classes by unit
     * @param unit_educational
     * @param parallel_id
     * @param activeUnit selected unit
     * @param activeSubject selected subject
     */
    getClassFromUnit(unit_educational, parallel_id, activeUnit, activeSubject, period) {
        return this.afs.collection('cuenca').doc(`${unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}`)
            .collection('classes', ref => ref.orderBy('fromDate', 'desc')).valueChanges();
    }

    getAllClassFromUnit(unit_educational, parallel_id, subject_id, unit_id, period) {
        return this.afs.collection('cuenca').doc(`${unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units/${unit_id}`)
            .collection('classes', ref => ref.orderBy('fromDate', 'desc')).get();
    }


    /**
     *  update status class
     * @param unit_educational
     * @param parallel_id
     * @param activeUnit
     * @param activeSubject
     * @param class_id
     */
    updateClass(unit_educational, parallel_id, activeUnit, activeSubject, class_id, period) {
        return this.afs.collection(`/cuenca/${unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`)
            .doc(`${class_id}`).update({'class_status': true });
    }

    /**
     * Get textbooks
     * @param subject_id
     * @param grade_id
     */
    getTextbook(unit_educational_id: String, parallelsId: String, subjectId: String, unitId: String, period: any) {
        return this.afs.collection('cuenca').doc(`${unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('planification').doc('planification_parallels')
            .collection('parallels').doc(`${parallelsId}`).collection('subjects').doc(`${subjectId}`).collection('units').doc(`${unitId}`)
            .collection('resources').valueChanges()
    }

    /**
     * Get videos
     * @param subject_id
     * @param grade_id
     */
    getVideo(subject_id, grade_id) {
        return this.afs.collection(`/external_resourses/uploaded_files/video`,
            ref => ref.where('id_subject', '==', `${subject_id}`) && ref.where('id_grade', '==', `${grade_id}`)).valueChanges();
    }

    getResources(unit_educational, parallel_id, subject_id, unit_id, class_id, period) {
        // console.log(`${unit_educational}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units/${unit_id}/classes/${class_id}`)
        return this.afs.collection('cuenca').doc(`${unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units/${unit_id}/classes/${class_id}`)
            .collection('resources', ref => ref.where('resource_status', '==', false)
                .orderBy('resource_index')).valueChanges();
    }

    public getEvaluation(unit_educational_id: String, parallel_id: String, subject_id: String, unit_id: String, class_id: String, period: any) {
        return this.afs.collection('cuenca').doc(`${unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('planification').doc('planification_parallels')
            .collection('parallels').doc(`${parallel_id}`).collection('subjects').doc(`${subject_id}`).collection('units').doc(`${unit_id}`)
            .collection('classes').doc(`${class_id}`).collection('evaluations').valueChanges()
    }

    /**
     * Get practices
     * @param subject_id
     * @param grade_id
     * @param parallel_id
     */
    getPractices(subject_id, grade_id, parallel_id) {
        return this.afs.collection(`/practices`, ref => ref.where('id_subject', '==', `${subject_id}`) && ref.where('id_grade', '==', `${grade_id}`)
            && ref.where('parallel_id', '==', `${parallel_id}`)).valueChanges();
    }

    /**
     * get class saved in student collection
     */
    getStudenClass(student_id, subjectId, unit_id) {
        /*console.log(`/student/${student_id}/subjects/${subjectId}/unit/${unit_id}/class`);*/
        return this.afs.collection(`/student/${student_id}/subjects/${subjectId}/unit/${unit_id}/class`).valueChanges();
    }


    getAllStudenClass(student_id, subjectId, unit_id) {
        return this.afs.collection(`/student/${student_id}/subjects/${subjectId}/unit/${unit_id}/class`).get();
    }


    /**
     * Check if the notes were seen by the student
     *
     */
    checkViewedNotes(student_id, subject_id, unit_id, class_id, resource) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/notes/class_notes`)
            .doc(`${resource.note_title}`).valueChanges();

        //this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
        //.collection('class').doc(`${class_id}`).collection('notes').doc
    }

    public updateViewedNotes(student_id, subject_id, unit_id, class_id) {
        const newId = new Date().getTime().toString()
        const classNotes = {
            'class_notes_status': true,
            'note_view_id': newId,

        }
        this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
            .collection('class').doc(`${class_id}`).collection('class_notes').doc(`${newId}`).set(classNotes)
    }

    public checkNotesClass(student_id, subject_id, unit_id, class_id) {
        return this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
            .collection('class').doc(`${class_id}`).collection('class_notes').valueChanges()
    }

    /**
     * Check if the notes were seen by the student
     *
     */
    checkUnitViewedNotes(student_id, subject_id, unit_id, resource) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/unit_notes`)
            .doc(`${resource.note_title}`).valueChanges();
    }

    /**
     * Check if the notes were seen by the student
     */
    updateCheckViewedNotes(student_id, subject_id, unit_id, class_id, resource) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources/notes/class_notes`)
            .doc(`${resource.note_title}`).set(resource);
    }

    /**
     * Check if the notes were seen by the student
     */
    updateCheckUnitViewedNotes(student_id, subject_id, unit_id, resource) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/unit_notes`).doc(`${resource.note_title}`)
            .set(resource);
    }

    /**
     * Check if the resources were opened by the student
     */
    checkReosurces(student_id, subject_id, unit_id, class_id, resource_id) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource_id}`).valueChanges();
    }

    /*checkEvaluation(student_id, subject_id, unit_id, class_id, evaluation_id) {
      return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/evaluation`).doc(`${evaluation_id}`).valueChanges();
    }*/

    public checkEvaluation(student_id, subject_id, unit_id, class_id) {
        const res = this.afs
            .collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/evaluation`)
            .valueChanges();
        return res;
    }

    public checkEvaluationId(student_id, subject_id, unit_id, class_id, evaluation_id) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/evaluation`).doc(`${evaluation_id}`).valueChanges();
    }

    /**
     * save the tracing resource
     */
    public saveResources(idIntent, student_id, subject_id, unit_id, class_id, resource) {
        this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`)
            .doc(`${resource.resource_id}`)
            .collection('entry')
            .doc(idIntent)
            .set(resource)
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).set(resource);
    }

    /*updateReosurce(student_id, subject_id, unit_id, class_id, resource, data, isIntents) {
      if (isIntents) {
      const dataIntents = {
        'intents': data
      }
      //  this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).collection('entry').doc(idIntent).set(resource)
      return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).update(dataIntents);
      }  else  if (!isIntents) {
        const dataIntents = {
          'resource_status': data
        }
        //  this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).collection('entry').doc(idIntent).set(resource)
       return  this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).update(dataIntents);
        }

    }*/

    public saveClassResource(student_id: string, subject_id: string, unit_id: string, class_id: string,
                             class_status: boolean, isUpdate: boolean, indexResource: number) {
        const evaluationStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return evaluationStatus.update({
                'status': class_status,
                'index_resource': indexResource,
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        } else {
            return evaluationStatus.set({
                'status': class_status,
                'class_id': class_id,
                'index_resource': indexResource,
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    /**
     * UPDATED METHODS
     * **/
    public saveStatusVideoClass(student_id: string, subject_id: string, unit_id: string, class_id: string, isUpdate: boolean) {
        const evaluationStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return evaluationStatus.update({
                'videoClassStatus': true,
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });


        } else {
            return evaluationStatus.set({
                'videoClassStatus': true,
                'class_id': class_id
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    public saveStatusForumClass(student_id: string, subject_id: string, unit_id: string, class_id: string, isUpdate: boolean) {
        const videoConferenceStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return videoConferenceStatus.update({
                'forumClassStatus': true,
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        } else {
            return videoConferenceStatus.set({
                'forumClassStatus': true,
                'class_id': class_id
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    public saveStatusVideoConference(student_id: string, subject_id: string, unit_id: string, class_id: string, isUpdate: boolean) {
        const videoConferenceStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return videoConferenceStatus.update({
                'videoConferenceStatus': true
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        } else {
            return videoConferenceStatus.set({
                'videoConferenceStatus': true,
                'class_id': class_id
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    public saveStatusEvaluation(student_id: string, subject_id: string, unit_id: string, class_id: string, isUpdate: boolean) {
        const evaluationStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return evaluationStatus.update({
                'evaluationClassStatus': true
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        } else {
            return evaluationStatus.set({
                'evaluationClassStatus': true,
                'class_id': class_id
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    public saveStatusNotesClass(student_id: string, subject_id: string, unit_id: string, class_id: string, isUpdate: boolean) {
        const evaluationStatus = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id);
        if (isUpdate) {
            return evaluationStatus.update({
                'notesClassStatus': true,
            })
                .then(function () {
                    console.log('Document successfully updated!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        } else {
            return evaluationStatus.set({
                'notesClassStatus': true,
                'class_id': class_id
            })
                .then(function () {
                    console.log('Document successfully Created!');
                })
                .catch(function (error) {
                    console.error('Error updating document: ', error);
                });
        }
    }

    public getClassStatus(student_id: string, subject_id: string, unit_id: string, class_id: string) {
        return this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id)
            .valueChanges()
    }

    entrySize(student_id, subject_id, unit_id, class_id, resource) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`).collection('entry')
            .get();
    }

    /**
     * GUARDAR ESTADISTICAS DE ESTUDIANTE EN ITEM DE PREGUNTA DE PRACTICA
     * @param student_id
     * @param subjectId
     * @param unit_id
     * @param class_id
     * @param resourceId
     * @param attemptInformation
     * @param idIntent
     */
    public saveInformationOfPracticeItems(student_id: String, subjectId: String, unit_id: String, class_id: String, resourceId: String, attemptInformation: InformationPracticeQuestion, idIntent: String) {
        this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subjectId}`).collection('unit').doc(`${unit_id}`)
            .collection('class').doc(`${class_id}`).collection('resources').doc(`${resourceId}`).collection('entry').doc(`${idIntent}`).collection('practiceAttempts').doc(`${attemptInformation.practiceAttemptsId}`).collection('attemptDetail').doc(`${attemptInformation.questionId}`).set(attemptInformation);
    }

    /**
     * GUARDAR DATOS DE PREGUNTA
     * @param student_id
     * @param subjectId
     * @param unit_id
     * @param class_id
     * @param resourceId
     * @param attemptInformation
     * @param idIntent
     * @param Practice
     */
    public savePracticeInformation(student_id: String, subjectId: String, unit_id: String, class_id: String, resourceId: String, attemptInformation: InformationPracticeQuestion, idIntent: String, Practice: Adminpractices[]) {
        const practiceIinformation = Practice[0]
        this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subjectId}`).collection('unit').doc(`${unit_id}`)
            .collection('class').doc(`${class_id}`).collection('resources').doc(`${resourceId}`).collection('entry').doc(`${idIntent}`).collection('practiceAttempts').doc(`${attemptInformation.practiceAttemptsId}`).set(practiceIinformation)
    }

    public getStudentReportDataByClass(student_id: String, subjectId: String, unit_id: String, class_id: String, resourceId: String) {
        return this.afs.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subjectId}`).collection('unit').doc(`${unit_id}`)
            .collection('class').doc(`${class_id}`).collection('resources').doc(`${resourceId}`).valueChanges()
    }

    public saveTempEstudentAnswer(student_id, subject_id, unit_id, class_id, resource, answer) {
        return this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`).doc(`${resource.resource_id}`)
            .collection('resource_answer').doc('answer').set(answer)
    }

    public saveEstudentAnswer(student_id, subject_id, unit_id, class_id, resource, answer) {
        this.afs.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`)
            .doc(`${resource.resource_id}`)
            .collection('resource_answer').doc('answer')
            .set(answer);
    }

    public saveStudentAnswer (student_id: string, subject_id: string, unit_id: string, class_id: string, resourceID: string, answer: any) {
        const saveAnswer = this.afs.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id)
            .collection('resources')
            .doc(resourceID)
            .collection('resource_answer')
            .doc('answer')
        return saveAnswer.set(answer);
    }
}
