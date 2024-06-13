import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class WeighServicesService {

    constructor(
        private db: AngularFirestore
    ) {
    }

    public async getTeacherParallelsIDList(teacherID: string, unitEducationalID: string) {
        return await this.db.collection('teacher')
            .doc(teacherID)
            .collection('unit_educational')
            .doc(unitEducationalID)
            .collection('parallels')
            .get()
            .toPromise();
    }

    public async getUnitEducationalParallelList(unitEducationalID: string, parallelID: string) {
        return await this.db.collection('cuenca')
            .doc(unitEducationalID)
            .collection('parallels')
            .doc(parallelID)
            .get()
            .toPromise();
    }

    public async getTeacherSubject(teacherID: string, unitEducationalID: string, parallelID: string) {
        return await this.db.collection('teacher')
            .doc(teacherID)
            .collection('unit_educational')
            .doc(unitEducationalID)
            .collection('parallels')
            .doc(parallelID)
            .collection('subjects')
            .get()
            .toPromise();
    }

    public async getSubjectUnitList(unitEducationalID: string, parallelID: string, subjectID: string) {
        const unitList = await this.db
            .collection('cuenca')
            .doc(unitEducationalID)
            .collection('planification')
            .doc('planification_parallels')
            .collection('parallels')
            .doc(parallelID)
            .collection('subjects')
            .doc(subjectID)
            .collection('units', ref => ref.where('statusUnit', '==', true)
                .where('pUnit', '>', 0))
        return unitList.get().toPromise()
    }

    public async getClassUnitList(unitEducationalID: string, parallelID: string, subjectID: string, unitID: string) {
        const classList = await this.db.collection('cuenca')
            .doc(unitEducationalID)
            .collection('planification')
            .doc('planification_parallels')
            .collection('parallels')
            .doc(parallelID)
            .collection('subjects')
            .doc(subjectID)
            .collection('units')
            .doc(unitID)
            .collection('classes', ref => ref.where('class_status', '==', true)
                .where('weighSum', '>', 0))
        return classList.get().toPromise()

    }

    public async getEssaysFromClass(unitEducationalID: string, parallelID: string, subjectID: string, unitID: string, classID: string) {
        const unitList = await this.db.collection('cuenca')
            .doc(unitEducationalID)
            .collection('planification')
            .doc('planification_parallels')
            .collection('parallels')
            .doc(parallelID)
            .collection('subjects')
            .doc(subjectID)
            .collection('units')
            .doc(unitID)
            .collection('classes')
            .doc(classID)
            .collection('resources', ref => {
                return ref
                    .where('resource_type', '==', 'essay')
                    .where('resource_rubric', '==', true)
                    .where('evaluation_peso' , '>' , 0)
            })
        return unitList.get().toPromise()
    }

    public async getEvaluationFromClass(unitEducationalID: string, parallelID: string, subjectID: string, unitID: string, classID: string) {
        const unitList = await this.db.collection('cuenca')
            .doc(unitEducationalID)
            .collection('planification')
            .doc('planification_parallels')
            .collection('parallels')
            .doc(parallelID)
            .collection('subjects')
            .doc(subjectID)
            .collection('units')
            .doc(unitID)
            .collection('classes')
            .doc(classID)
            .collection('evaluations')
        return unitList.get().toPromise()
    }

    public async getValueFromEssay (essayID: string) {
        return await this.db.collection('essays')
            .doc(essayID)
            .collection('essay_items')
            .get().toPromise()
    }

    public async getValueFromEvaluation (essayID: string) {
        return await this.db.collection('evaluations')
            .doc(essayID)
            .get().toPromise()
    }

    public async findStudents(unitEducationalID: string, parallelID: string) {
        return await this.db.collection('student', ref => ref
            .where('student_unit_educational', '==', unitEducationalID)
            .where('student_parallel_id', '==', parallelID)
            .where('student_status', '==', true))
            .get()
            .toPromise();
    }

    public async getScoring(studentID: string, subjectID: string, unitID: string, classID: string, resourceID: string, type: string) {

        if (type === 'essays') {
            return await this.db.collection('student')
                .doc(studentID)
                .collection('subjects')
                .doc(subjectID)
                .collection('unit')
                .doc(unitID)
                .collection('class')
                .doc(classID)
                .collection('resources')
                .doc(resourceID)
                .get()
                .toPromise();
        } else {
            return await this.db.collection('student')
                .doc(studentID)
                .collection('subjects')
                .doc(subjectID)
                .collection('unit')
                .doc(unitID)
                .collection('class')
                .doc(classID)
                .collection('evaluation')
                .doc(resourceID)
                .get()
                .toPromise();
        }

    }

}
