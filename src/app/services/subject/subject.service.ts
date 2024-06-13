import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot} from '@angular/fire/firestore'

/** Models */
import {Level} from 'app/models/class/class.documentLevel';
import {SubLevels} from 'app/models/class/class.documentSubLevels';
import {Subject} from 'app/models/class/classdocumentSubject';
import {Academyareadocum} from 'app/models/academyarea/academyareadocum.model'
import {UnitEducational} from 'app/models/class/class.documentUnitEducational';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    subjectCollection: AngularFirestoreCollection<Subject>

    constructor(private db: AngularFirestore) {
        this.subjectCollection = this.db.collection<Subject>('subjects')
    }

    /** Guardar asignatura.
     * @param subject
     */
    public saveSubject(subject: Subject): Promise<void> {
        const collectionSubject = this.db.collection(`config`).doc('general_config')
            .collection<Level>(`levels`).doc(`${subject.level_id}`).collection<SubLevels>(`sublevels`).doc(`${subject.sublevel_id}`)
            .collection<Academyareadocum>(`academy_area`).doc(`${subject.area_acad_id}`)
            .collection<Subject>('subjects').doc(`${subject.subject_id}`);
        if (collectionSubject) {
            return collectionSubject.set(subject);
        }
    }

    /**
     * Obtener listado de asignaturas.
     * @param levelId
     * @param sublevelId
     * @param areaId
     */
    public getAllSubjects(levelId: string, sublevelId: string, areaId: string): any {
        return this.db.collection(`config`).doc('general_config').collection<Level>('levels').doc(`${levelId}`)
            .collection<SubLevels>('sublevels').doc(`${sublevelId}`).collection<Academyareadocum>('academy_area').doc(`${areaId}`)
            .collection<Subject>('subjects').valueChanges()
    }

    /**
     * Obtener lista de asignaturas activas.
     * @param levelId
     * @param sublevelId
     * @param areaId
     */

    public getAllSubjectsActive(levelId: string, sublevelId: string, areaId: string): any {
        return this.db.collection(`config`)
            .doc('general_config')
            .collection<Level>('levels')
            .doc(`${levelId}`)
            .collection<SubLevels>('sublevels')
            .doc(`${sublevelId}`)
            .collection<Academyareadocum>('academy_area')
            .doc(`${areaId}`)
            .collection<Subject>('subjects', ref => ref.where('subject_status', '==', true))
            .valueChanges()
    }


    public async getAllSubjectsActiveNotRealTime(levelID: string, subLevelID: string, areaID: string) {
        return await this.db.collection('config')
            .doc('general_config')
            .collection<Level>('levels')
            .doc(levelID)
            .collection<SubLevels>('sublevels')
            .doc(subLevelID)
            .collection<Academyareadocum>('academy_area')
            .doc(areaID)
            .collection<Subject>('subjects', ref => ref.where('subject_status', '==', true))
            .get().toPromise();
    }

    /**
     * Eliminar de manera logica la asignatura.
     * @param subject
     */
    public deleteSubject(subject: Subject): void {
        const collectionSubject = this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${subject.level_id}`)
            .collection(`sublevels`).doc(`${subject.sublevel_id}`).collection<Academyareadocum>(`academy_area`).doc(`${subject.area_acad_id}`)
            .collection<Subject>(`subjects`).doc(`${subject.subject_id}`);
        collectionSubject.update({
            'subject_status': false,
        });
    }

    /**
     * Obtener listado de asignaturas que pertenecen a una Unidad Educativa.
     * @param unitEducational
     * @param subject
     */

    public getSubjectsUnitEducational(unitEducational: UnitEducational, subject: Subject): any {
        const collection = this.db.collection(unitEducational.unit_educational_city.toLowerCase())
            .doc(unitEducational.unit_educational_id.toString())
            .collection<Academyareadocum>(`subjects`)
            .doc(`${subject.subject_id}`);
        return collection.valueChanges();
    }

    public async getSubjectsUnitEducationalNotRealTime(unitEducational: UnitEducational): Promise<QuerySnapshot<DocumentData>> {
        return await this.db.collection(unitEducational.unit_educational_city.toLowerCase())
            .doc(unitEducational.unit_educational_id.toString())
            .collection<Academyareadocum>('subjects', ref => ref.where('subject_status', '==', true))
            .get().toPromise();
    }

    /**
     * Obtener listado de asignaturas que pertenecen a una Unidad Educativa.
     * @param unitEducational
     * @param subject
     */

    public getSubjectFromSubjectId(unitEducationalId: String, subjectId: String): any {
        return this.db.collection('cuenca').doc(`${unitEducationalId}`).collection<Subject>(`subjects`).doc(`${subjectId}`).valueChanges();
    }
}
