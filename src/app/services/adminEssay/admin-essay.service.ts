import {Injectable} from '@angular/core';
import {Adminpractices} from '../../models/class/class.documentadminpractices';
import {TypePractice} from '../../models/class/class.documenttype-practice';
import {Rubric, RubricJudgement, RubricPoint} from '../../models/class/class.documentrubric';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AdminEssayService {

    constructor(private db: AngularFirestore) {
    }

    public getEssayFromTeacherIdAndGradeId(unit_educational: string) {
        return this.db
            .collection('essays', ref => ref.where('unit_educational_id_from_teacher', '==', unit_educational))
            .valueChanges()

    }

    public createEssay(essay: Adminpractices) {
        return this.db.collection('essays').doc(essay.essay_id.toString()).set(essay);
    }

    public getEssay(essay_id: String) {
        return this.db
            .collection<Adminpractices>('essays', ref => ref.where('essay_id', '==', essay_id))
            .valueChanges();
    }

    public getOptionsFromEssay(essayId: String) {
        return this.db
            .collection('essays')
            .doc(`${essayId}`)
            .collection('essay_items')
            .valueChanges();
    }

    public updateEssay(essayId: String, data: Object) {
        this.db.collection('essays').doc(essayId.toString()).update(data);
    }

    public async createOptionEssay(essay_id: String, option: TypePractice, isNew: boolean) {
        const optionP = this.db.collection('essays')
            .doc(`${essay_id}`)
            .collection('essay_items')
            .doc(`${option.option_id}`);
        if (isNew) {
            await optionP.set(option);
        } else {
            await optionP.update(option)
        }
    }

    public async createQuestionEssay(essay_id: String, option: TypePractice, isNew: boolean) {
        const optionP = this.db.collection('essays')
            .doc(`${essay_id}`)
            .collection('essay_items').doc(`${option.option_id}`);
        if (isNew) {
            await optionP.set(option);
        } else {
            await optionP.update(option)
        }
    }

    public deleteOptionFromEssay(essay_id: String, option: TypePractice, rubric: Rubric) {
        this.db.doc(`essays/${essay_id}/essay_items/${option.option_id}`).delete()
            .then(() => {
                this.db.doc(`essays/${essay_id}/essay_rubric/${rubric.rubric_id}`).delete();
            });
    }

    /* Rubricas */

    public async createRubricEssay(essay_id: string, rubric: Rubric, rubricJudgements: RubricJudgement[],
                                   rubricPoints: RubricPoint[], isSave: boolean) {
        const essayRubricCreation = this.db
            .collection('essays')
            .doc(essay_id)
            .collection('essay_rubric')
            .doc(rubric.rubric_id);

        if (!isSave) {
            essayRubricCreation
                .set(Object.assign({}, rubric))
                .then(() => {
                    for (const rubricPoint of rubricPoints) {
                        const rubricP = essayRubricCreation.ref
                            .collection('rubric_points')
                            .doc(rubricPoint.rubric_point_id);
                        rubricP.get()
                            .then(rubricPointAux => {
                            if (rubricPointAux.exists) {
                                rubricP
                                    .set(Object.assign({}, rubricPoint))
                                    .then(() => console.log('RUBRIC POINT REGISTER !!!!!'))
                                    .catch(reason => console.log('ERROR REGISTER RUBRIC POINT !!!!!', reason));
                            } else {
                                rubricP
                                    .set(Object.assign({}, rubricPoint))
                                    .then(() => console.log('RUBRIC POINT REGISTER !!!!!'))
                                    .catch(reason => console.log('ERROR REGISTER RUBRIC POINT !!!!!', reason));
                            }
                        }).catch(reason => console.log('ERROR TO CPY RUBRIC POINT !!! ', reason));
                    }
                    for (const rubricJudgement of rubricJudgements) {
                        const items = rubricJudgement.rubric_judgement_items;
                        delete rubricJudgement.rubric_judgement_items;
                        const rubricJudge = essayRubricCreation.ref
                            .collection('rubric_judgements')
                            .doc(rubricJudgement.rubric_judgement_id);
                        rubricJudge.get()
                            .then(rubricPointAux => {
                            if (rubricPointAux.exists) {
                                rubricJudge
                                    .set(Object.assign({}, rubricJudgement))
                                    .then(() => console.log('RUBRIC JUDGEMENT REGISTER !!!!!'))
                                    .catch(reason => console.log('ERROR REGISTER RUBRIC JUDGEMENT !!!!!', reason));
                            } else {
                                rubricJudge
                                    .set(Object.assign({}, rubricJudgement))
                                    .then(() => console.log('RUBRIC JUDGEMENT REGISTER !!!!!'))
                                    .catch(reason => console.log('ERROR REGISTER RUBRIC JUDGEMENT !!!!!', reason));
                            }
                        })
                            .catch(reason => console.log('ERROR CREATING RUBRIC JUDGEMENTS !!!!', reason));
                        for (const item of items) {
                          const itemRubricJudgement = rubricJudge
                              .collection('rubric_items')
                              .doc(item.rubric_judgement_item_id);
                          itemRubricJudgement
                              .get()
                              .then(value => {
                                if (value.exists) {
                                  itemRubricJudgement
                                      .set(Object.assign({}, item))
                                      .then(() => console.log('ITEM RUBRIC JUDGEMENT CREATED !!!'))
                                      .catch(reason => console.log('ERROR CREATING ITEM RUBRIC JUDGEMENT CREATES !!!', reason));
                                } else {
                                  itemRubricJudgement
                                      .set(Object.assign({}, item))
                                      .then(() => console.log('ITEM RUBRIC JUDGEMENT CREATED !!!'))
                                      .catch(reason => console.log('ERROR CREATING ITEM RUBRIC JUDGEMENT CREATES !!!', reason));
                                }
                              })
                              .catch(reason => console.log('ERROR SAVING ITEM RUBRIC JUDGEMENT !!!', reason));
                        }
                    }
                }).catch(reason => console.log('ERROR UPDATING DATA !!!!!', reason));
        } else {
            await essayRubricCreation.update(Object.assign({}, rubric)).then(() => {
                this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                    .collection('rubric_points').get().toPromise()
                    .then(data => {
                        data.forEach(d => {
                            this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                                .collection('rubric_points').doc(d.data().rubric_point_id).delete();
                        });
                        rubricPoints.forEach(r => {
                            this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                                .collection('rubric_points').doc(r.rubric_point_id).set(Object.assign({}, r));
                        });
                    });
                this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                    .collection('rubric_judgements').get().toPromise()
                    .then(data => {
                        data.forEach(d => {
                            this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                                .collection('rubric_judgements').doc(d.data().rubric_judgement_id).delete();
                        })
                        rubricJudgements.forEach(rj => {
                            const items = rj.rubric_judgement_items;
                            delete rj.rubric_judgement_items;

                            this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                                .collection('rubric_judgements').doc(rj.rubric_judgement_id).set(Object.assign({}, rj));
                            items.forEach(i => {
                                this.db.collection('essays').doc(`${essay_id}`).collection('essay_rubric').doc(`${rubric.rubric_id}`)
                                    .collection('rubric_judgements').doc(rj.rubric_judgement_id).collection('rubric_items')
                                    .doc(i.rubric_judgement_item_id).set(Object.assign({}, i));
                            })
                        })
                    });
            });
        }
    }

    public getRubric(essay_id: String) {
        return this.db
            .collection<RubricPoint>('essays')
            .doc(essay_id.toString())
            .collection('essay_rubric')
            .valueChanges();
        // this.db.collection('essays', ref =>  ref.where('essay_name', '==', essay_id)).valueChanges();
    }

    public getRubricPoints(essay_id: String, rubric: Rubric) {
        return this.db.collection<RubricPoint>('essays').doc(essay_id.toString()).collection('essay_rubric')
            .doc(rubric.rubric_id).collection('rubric_points').valueChanges();
    }

    public getRubricJudgements(essay_id: String, rubric: Rubric) {
        console.log(essay_id.toString(), ' ', rubric.rubric_id)
        return this.db.collection<RubricPoint>('essays').doc(essay_id.toString()).collection('essay_rubric')
            .doc(rubric.rubric_id).collection('rubric_judgements').valueChanges();
    }

    public getRubricJudgementItems(essay_id: String, rubric: Rubric, judge: RubricJudgement) {
        return this.db
            .collection<RubricPoint>('essays')
            .doc(essay_id.toString())
            .collection('essay_rubric')
            .doc(rubric.rubric_id)
            .collection('rubric_judgements')
            .doc(judge.rubric_judgement_id)
            .collection('rubric_items')
            .valueChanges();
    }

    /* Student Essay */

    public getStudentAnswer(student_id, subject_id, unit_id, class_id, resource_id) {


        const answer = this.db.collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources/${resource_id}/resource_answer`)
            .valueChanges();
        if (answer) {
            return answer;
        }
    }

    public async getStudentAnswerV2(student_id: string, subject_id: string, unit_id: string, class_id: string, resource_id: string) {
        const studentAnswer = await this.db.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id)
            .collection('resources')
            .doc(resource_id)
            .collection('resource_answer')
            .doc('answer');
        return studentAnswer.get().toPromise();
    }

    public getStudentCalifications(student_id, subject_id, unit_id, class_id, resource_id) {
        const calif = this.db
            .collection(`/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources/${resource_id}/resource_calification_items`)
            .valueChanges();
        if (calif) {
            return calif;
        }
    }

    async saveComment(student_id, subject_id, unit_id, class_id, resource_id, comment) {
        return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`)
            .collection('unit').doc(unit_id).collection('class').doc(class_id)
            .collection('resources').doc(resource_id).collection('resource_answer').doc('answer')
            .update({'resource_comment': comment});
    }

    public saveStudentQualification(student_id: string, subject_id: string, unit_id: string, class_id: string, resource_id: string,
                                    rubricJudgements: RubricJudgement[], isNew: boolean) {
        let rubricCont = 0;
        for (const rubricJudgement of rubricJudgements) {
            for (const rubricJudgementItem of rubricJudgement.rubric_judgement_items) {
                const rubricItem = this.db.collection('student')
                    .doc(student_id)
                    .collection('subjects')
                    .doc(subject_id)
                    .collection('unit')
                    .doc(unit_id)
                    .collection('class')
                    .doc(class_id)
                    .collection('resources')
                    .doc(resource_id)
                    .collection('resource_calification_items')
                    .doc(rubricJudgementItem.rubric_judgement_item_id);
                if (isNew === true && rubricJudgementItem.selected === true) {
                    rubricCont = rubricCont + rubricJudgementItem.rubric_judgement_item_calification;
                    rubricItem
                        .set(rubricJudgementItem)
                        .then(() => console.log('PUNTOS ALMACENADOS !!!!!'))
                        .catch(reason => console.log('ERROR AL REGISTRAR RUBRICA !!!! ', reason));

                } else {
                    if (rubricJudgementItem.selected === true) {
                        rubricCont = rubricCont + (+rubricJudgementItem.rubric_judgement_item_calification);
                        rubricItem.get().toPromise().then(value => {
                            if (value.exists) {
                                rubricItem
                                    .set(rubricJudgementItem)
                                    .then(() => console.log('PUNTOS ACTUALIZADOS !!!!!', rubricJudgementItem.rubric_judgement_item_id))
                                    .catch(reason => console.log('ERROR AL REGISTRAR RUBRICA !!!! ', reason));
                            } else {
                                rubricItem
                                    .set(rubricJudgementItem)
                                    .then(() => console.log('PUNTOS ACTUALIZADOS !!!!!', rubricJudgementItem.rubric_judgement_item_id))
                                    .catch(reason => console.log('ERROR AL REGISTRAR RUBRICA !!!! ', reason));
                            }
                        });
                    } else {
                        rubricItem
                            .delete()
                            .then(() => console.log('CALIFICACION ELIMINADA'))
                            .catch(reason => console.log('ERROR ELIMINADO RUBRICA !!!!', reason))
                    }
                }
            }
        }
        const resourceQualification = this.db.collection('student')
            .doc(student_id)
            .collection('subjects')
            .doc(subject_id)
            .collection('unit')
            .doc(unit_id)
            .collection('class')
            .doc(class_id)
            .collection('resources')
            .doc(resource_id);
        resourceQualification
            .update({
                'qualification': rubricCont
            }).then(() => console.log('QUALIFICATION UPDATED !!!!'))
            .catch(reason => console.log('ERROR UPDATING STUDENT QUALIFICATION !!! ', reason));
    }

    public deleteEssay(essay_id: string) {
        return this.db.collection<Adminpractices>('essays').doc(essay_id).update({'public_status_practice': false,});
    }
}
