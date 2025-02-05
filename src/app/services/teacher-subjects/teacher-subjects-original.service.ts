import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Listtext } from "../../models/class/classdocumenttext";
import { Teacher } from "app/models/teacher/teacher.model";
import { Subject } from "app/models/class/classdocumentSubject";
import { Resource } from "../../models/class/class.resource";
import { TypePractice } from "../../models/class/class.documenttype-practice";
import { WeightUnitObjectDTO } from "../../models/dto/pesos/WeightUnitObjectDTO";
import { WeightComponentsObjectDTO } from "../../models/dto/pesos/WeightComponentsObjectDTO";
import { WeightClassObjectDTO } from "../../models/dto/pesos/WeightClassObjectDTO";
import { Classdocum } from "../../models/class/class.documentclass";
import * as firebase from "firebase";

interface InitProcessParams {
  unitEducationalID: string;
  parallelID: string;
  subjectID: string;
}

@Injectable({
  providedIn: "root",
})
export class TeacherSubjectsOriginalService {
  private weightUnitObjectDTOList: WeightUnitObjectDTO[] = [];

  constructor(public afs: AngularFirestore) {}

  /* Add new Unit to teacher subject
   ** @param teacherClass
   * */
  setTeacherSubjectUnit(teacher: Teacher, teacherClass) {
    const unit_id = Date.now().toString();
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${teacherClass.parallel}/subjects/${teacherClass.subject}/units`
      )
      .doc(unit_id)
      .set({ unit_id, ...teacherClass, unit_notes: [] });
  }

  public editTeacherSubjectUnit(teacher: Teacher, unit) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${unit.parallel}/subjects/${unit.subject}/units`
      )
      .doc(unit.unit_id)
      .update(unit);
  }

  /* Add new class to Subject Unit
   ** @param classForm
   * */
  setClassToSubject(teacher: Teacher, classForm, activeSubject, activeUnit) {
    const class_id = Date.now().toString();
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(class_id)
      .set({ class_id, ...classForm, class_status: false, class_notes: [] });
  }

  public editClassToSubject(
    teacher: Teacher,
    classForm,
    activeSubject,
    activeUnit
  ) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(classForm.class_id)
      .update(classForm);
  }

  /* Add new note to class or unit
   ** @param noteForm
   ** @param noteType
   ** @param activeSubject
   * */
  setNote(
    teacher: Teacher,
    noteForm,
    noteType,
    activeSubject,
    activeUnit,
    activeClass
  ) {
    if (noteType === "class") {
      return this.afs
        .collection(
          `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
        )
        .doc(activeClass.class_id)
        .update({ class_notes: activeClass.class_notes });
    } else if (noteType === "unit") {
      return this.afs
        .collection(
          `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units`
        )
        .doc(activeUnit.unit_id)
        .update({ unit_notes: activeUnit.unit_notes });
    }
  }

  /* Add new resource to class
   ** @param activeSubject
   ** @param activeUnit
   ** @param activeClass
   ** @param resource
   * */
  setResourceToClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    resource: Resource
  ) {
    const resource_id = Date.now().toString();
    resource.resource_id = resource_id;
    let size = 0;
    this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("resources")
      .get()
      .toPromise()
      .then((snap) => {
        size = snap.size;
        let item = {};
        if (resource.resource_id) {
          item = { resource_index: size, ...resource };
          if (resource.resource_type === "essay") {
            this.updateContEssay(resource);
          }
          return this.afs
            .collection(
              `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
            )
            .doc(activeClass.class_id)
            .collection("resources")
            .doc(resource.resource_id)
            .set(item);
        } else {
          item = {
            resource_id: resource_id,
            resource_index: size,
            ...resource,
          };
          if (resource.resource_type === "essay") {
            this.updateContEssay(resource);
          }
          return this.afs
            .collection(
              `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
            )
            .doc(activeClass.class_id)
            .collection("resources")
            .doc(resource.resource_id)
            .set(item);
        }
      });
  }

  private updateContEssay(resource: Resource) {
    this.afs
      .collection("essays")
      .doc(resource.resource_url.replace("/essays/", ""))
      .collection("essay_items")
      .get()
      .toPromise()
      .then((objectRubric) => {
        objectRubric.forEach((data) => {
          const typePractice: TypePractice = data.data() as TypePractice;
          if (typePractice.useCount !== undefined) {
            typePractice.useCount = typePractice.useCount + 1;
          } else {
            typePractice.useCount = 1;
          }
          return data.ref
            .update(typePractice)
            .then(() => console.log("USE COUNT UPDATED !!!!"))
            .catch((reason) => console.log("ERROR !!!! ", reason));
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  updateEssayWeigh(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    evaluation,
    weigh: number
  ) {
    const resource = this.afs
      .collection("cuenca")
      .doc(teacher.teacher_unit_educational[0])
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(activeSubject.parallel_id)
      .collection("subjects")
      .doc(activeSubject.subject_id)
      .collection("units")
      .doc(activeUnit.unit_id)
      .collection("classes")
      .doc(activeClass.class_id)
      .collection("resources")
      .doc(evaluation.resource_id);
    resource
      .update({
        evaluation_peso: weigh,
      })
      .then(() => {
        console.log("Document successfully written!");
        this.updatingUnitClassValues(
          teacher,
          activeSubject,
          activeUnit,
          activeClass
        );
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  private updatingUnitClassValues(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass
  ) {
    const unit = this.afs
      .collection("cuenca")
      .doc(teacher.teacher_unit_educational[0])
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(activeSubject.parallel_id)
      .collection("subjects")
      .doc(activeSubject.subject_id)
      .collection("units")
      .doc(activeUnit.unit_id);
    const classes = unit.collection("classes").doc(activeClass.class_id);
    classes
      .collection("resources", (ref) => ref.where("evaluation_peso", ">", 0))
      .get()
      .toPromise()
      .then((value) => {
        let sumClasses = 0;
        if (!value.empty) {
          value.forEach((result) => {
            sumClasses = result.data().evaluation_peso + sumClasses;
          });
        }
        classes
          .update({
            weighSum: sumClasses,
          })
          .then(() => {
            unit
              .collection("classes", (ref) => ref.where("weighSum", ">", 0))
              .get()
              .toPromise()
              .then((value1) => {
                let sumUnit = 0;
                if (!value1.empty) {
                  sumUnit = 1;
                }
                unit
                  .update({
                    weighSum: sumUnit,
                  })
                  .then(() => console.log("UNIT WEIGH HAS BEEN UPDATED !!!!"))
                  .catch((reason) =>
                    console.log("ERROR UPDATING UNIT WIGH !!!", reason)
                  );
              });
          })
          .catch((reason) =>
            console.log("ERROR UPDATING CLASS WEIGH SUM !!!! ", reason)
          );
      });
  }

  getRubricEssay(essayCode: string): any {
    const unit = this.afs
      .collection("essays")
      .doc(essayCode)
      .collection("essay_rubric");
    return unit.get().toPromise();
  }

  saveVideoConferencia(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    video_conference
  ) {
    const video_conference_id = Date.now().toString();
    this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .update({
        video_conference: video_conference,
      });
  }

  saveVideoConferenciaToUnit(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    video_conference
  ) {
    const video_conference_id = Date.now().toString();
    this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units`
      )
      .doc(activeUnit.unit_id)
      .update({
        video_conferences:
          firebase.firestore.FieldValue.arrayUnion(video_conference),
      });
  }

  getVideoConferenciaFromUnit(teacher: Teacher, activeSubject, activeUnit) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units`
      )
      .doc(activeUnit.unit_id)
      .valueChanges();
  }

  deleteVideoConferenciaFromUnit(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    selectedVideo
  ) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units`
      )
      .doc(activeUnit.unit_id)
      .update({
        video_conferences:
          firebase.firestore.FieldValue.arrayRemove(selectedVideo),
      });
  }

  saveVideoClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    video_class
  ) {
    const video_class_id = Date.now().toString();
    this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .update({
        video_class: video_class,
      });
  }

  setEvaluationToClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    evaluation
  ) {
    const evaluation_id = Date.now().toString();
    let size = 0;
    this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("evaluations")
      .get()
      .toPromise()
      .then((snap) => {
        size = snap.size;
        return this.afs
          .collection(
            `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
          )
          .doc(activeClass.class_id)
          .collection("evaluations")
          .doc(evaluation_id)
          .set({ evaluation_id: evaluation_id, ...evaluation });
      });
  }

  updateEvaluationToClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    evaluation
  ) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("evaluations")
      .doc(evaluation.evaluation_id.toString())
      .set(evaluation);
  }

  /* Add new resource to unit
   ** @param activeSubject
   ** @param activeUnit
   ** @param resource
   * */
  setResourceToUnit(teacher: Teacher, activeSubject, activeUnit, resources) {
    resources.forEach((resource) => {
      if (resource.selected) {
        delete resource.selected;
        this.afs
          .collection(
            `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/resources`
          )
          .doc(Date.now().toString())
          .set(resource);
      }
    });
  }

  /* update resource index
   ** @param activeSubject
   ** @param activeUnit
   ** @param activeClass
   ** @param resourceList
   * */
  updateResourceIndex(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    resourceList
  ) {
    resourceList.forEach((resource) => {
      this.afs
        .collection(
          `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
        )
        .doc(activeClass.class_id)
        .collection("resources")
        .doc(resource.resource_id)
        .update(resource);
    });
  }

  /* update class status
   ** @param activeSubject
   ** @param activeUnit
   ** @param activeClass
   ** @param resourceList
   * */
  updateClassStatus(teacher: Teacher, activeSubject, activeUnit, activeClass) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .update(activeClass);
  }

  /* GET METHODS */

  /* Get teacher info
   ** @param teacher_id
   */
  public getTeacher(teacher_id: string) {
    return this.afs.collection("teacher").doc(teacher_id).valueChanges();
  }

  /* Get parallels from teacher
   * @param teacher_id
   * @param uniteducationalId
   */
  public getParallelsFromTeacherId(
    teacherId: String,
    uniteducationalId: String
  ) {
    const collectionTeacher = this.afs
      .collection<Teacher>("teacher")
      .doc(`${teacherId}`)
      .collection("unit_educational")
      .doc(`${uniteducationalId}`)
      .collection("parallels")
      .valueChanges();
    if (collectionTeacher) {
      return collectionTeacher;
    }
  }

  /* Get subjects from parallel
   * @param teacher_id
   * @param uniteducationalId
   * @param parallel_id
   */
  public getSubjectsFromParallelIid(
    teacherId: String,
    uniteducationalId: String,
    parallel_id: String
  ) {
    return this.afs
      .collection<Teacher>("teacher")
      .doc(`${teacherId}`)
      .collection("unit_educational")
      .doc(`${uniteducationalId}`)
      .collection("parallels")
      .doc(`${parallel_id}`)
      .collection("subjects")
      .valueChanges();
  }

  /* Get planification
   ** @param activeSubject
   */
  getSubjectUnits(teacher: Teacher, activeSubject) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units`,
        (ref) => ref.orderBy("unit_id", "desc")
      )
      .valueChanges();
  }

  getUnitsNoRealTimeQuery(teacher: Teacher, activeSubject): any {
    const docRef = this.afs
      .collection("cuenca")
      .doc(teacher.teacher_unit_educational[0])
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(activeSubject.parallel_id)
      .collection("subjects")
      .doc(activeSubject.subject_id)
      .collection("units", (ref) => ref.orderBy("unit_id", "desc"));
    return docRef.get().toPromise();
  }

  /* Get Classes from unit
   ** @param activeUnit
   ** @param activeSubject
   */
  public getClassFromUnit(teacher: Teacher, activeUnit, activeSubject) {
    return this.afs
      .collection("cuenca")
      .doc(`${teacher.teacher_unit_educational[0]}`)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(`${activeSubject.parallel_id}`)
      .collection("subjects")
      .doc(`${activeSubject.subject_id}`)
      .collection("units")
      .doc(`${activeUnit.unit_id}`)
      .collection("classes")
      .valueChanges();
  }

  public getPreviousClass(
    teacher: Teacher,
    activeUnit,
    activeSubject,
    lastDate
  ) {
    return this.afs
      .collection("cuenca")
      .doc(`${teacher.teacher_unit_educational[0]}`)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(`${activeSubject.parallel_id}`)
      .collection("subjects")
      .doc(`${activeSubject.subject_id}`)
      .collection("units")
      .doc(`${activeUnit.unit_id}`)
      .collection("classes", (ref) =>
        ref
          .where("class_id", "<", lastDate)
          .orderBy("class_id", "desc")
          .limit(1)
      )
      .valueChanges();
  }

  public getClassFromUnitTrue(teacher: Teacher, activeUnit, activeSubject) {
    // console.log(teacher.teacher_unit_educational[0] + ' : ' + activeSubject.parallel_id + ' : ' + activeSubject.subject_id + ' : ' + activeUnit.unit_id)
    return this.afs
      .collection("cuenca")
      .doc(`${teacher.teacher_unit_educational[0]}`)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(`${activeSubject.parallel_id}`)
      .collection("subjects")
      .doc(`${activeSubject.subject_id}`)
      .collection("units")
      .doc(`${activeUnit.unit_id}`)
      .collection("classes", (ref) => ref.orderBy("class_id", "desc").limit(3))
      .valueChanges();
  }

  getClassFromUnitTrueNoRealTimeQuery(
    teacher: Teacher,
    activeUnit,
    activeSubject
  ): any {
    const docRef = this.afs
      .collection("cuenca")
      .doc(`${teacher.teacher_unit_educational[0]}`)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(`${activeSubject.parallel_id}`)
      .collection("subjects")
      .doc(`${activeSubject.subject_id}`)
      .collection("units")
      .doc(`${activeUnit.unit_id}`)
      .collection("classes", (ref) => ref.orderBy("fromDate", "desc").limit(3));
    return docRef.get().toPromise();
  }

  /* Get Classes from unit
   ** @param activeUnit
   ** @param activeSubject
   ** @param activeClass
   */
  getClassResources(teacher: Teacher, activeUnit, activeSubject, activeClass) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("resources", (ref) =>
        ref.where("resource_status", "==", false).orderBy("resource_index")
      )
      .valueChanges();
  }

  getClassEvaluations(
    teacher: Teacher,
    activeUnit,
    activeSubject,
    activeClass
  ) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("evaluations", (ref) =>
        ref.where("evaluation_status", "==", false)
      )
      .valueChanges();
  }

  /* Get resources from unit
   ** @param teacher
   ** @param activeUnit
   ** @param activeSubject
   */
  getUnitResources(teacher: Teacher, activeUnit, activeSubject) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/resources`
      )
      .valueChanges();
  }

  /* EXTERNAL RESOURCES*/
  getExternalVideos(subject) {
    return this.afs
      .collection(
        "/external_resourses/uploaded_files/videos",
        (ref) => (
          ref.where("id_grade", "==", subject.grade_id),
          ref.where("id_subject", "==", subject.subject_id)
        )
      )
      .valueChanges();
  }

  getExternalTexts(subject) {
    // console.log(subject.subject_id);
    // console.log(subject.grade_id);

    return this.afs
      .collection<Listtext>(
        "/external_resourses/uploaded_files/textbooks",
        (ref) => (
          ref.where("id_grade", "==", subject.grade_id),
          ref.where("id_subject", "==", subject.subject_id)
        )
      )
      .valueChanges();
  }

  getExternalFiles(subject: Subject) {
    return this.afs
      .collection("/external_resourses/uploaded_files/attached_files", (ref) =>
        ref.where("id_subject", "==", subject.subject_id)
      )
      .valueChanges();
  }

  deleteExternalFiles(resource_id: String) {
    return this.afs
      .collection("external_resourses")
      .doc("uploaded_files")
      .collection("attached_files")
      .doc(`${resource_id}`)
      .delete();
  }

  getURLS(subject) {
    return this.afs
      .collection("/external_resourses/uploaded_files/urls", (ref) =>
        ref.where("id_subject", "==", subject.subject_id)
      )
      .valueChanges();
  }

  deleteURLS(resource_id: String) {
    return this.afs
      .collection("external_resourses")
      .doc("uploaded_files")
      .collection("urls")
      .doc(`${resource_id}`)
      .delete();
  }

  /* Get Practices from selected subject
   ** @param subject
   */
  getPractices(unit_educational_id) {
    const practices = this.afs.collection("practices", (ref) =>
      ref.where("unit_educational_id_from_teacher", "==", unit_educational_id)
    );
    if (practices) {
      return practices.valueChanges();
    }
  }

  getEssays(unit_educational_id: String) {
    const essays = this.afs.collection("essays", (ref) =>
      ref.where("unit_educational_id_from_teacher", "==", unit_educational_id)
    );
    if (essays) {
      return essays.valueChanges();
    }
  }

  getStudentResources(student_id, subject_id, unit_id, class_id) {
    return this.afs
      .collection(
        `/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/resources`
      )
      .valueChanges();
  }

  public getStudentEvaluation(student_id, subject_id, unit_id, class_id) {
    const res = this.afs
      .collection(
        `/student/${student_id}/subjects/${subject_id}/unit/${unit_id}/class/${class_id}/evaluation`
      )
      .valueChanges();
    return res;
  }

  public deleteResourceFromClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    resource
  ) {
    console.log(resource);
    const resourceFound = this.afs
      .collection("cuenca")
      .doc(teacher.teacher_unit_educational[0])
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(activeSubject.parallel_id)
      .collection("subjects")
      .doc(activeSubject.subject_id)
      .collection("units")
      .doc(activeUnit.unit_id)
      .collection("classes")
      .doc(activeClass.class_id)
      .collection("resources")
      .doc(resource.resource_id);

    resourceFound
      .get()
      .toPromise()
      .then((data) => {
        if (data.exists) {
          const resourceToDelete: Resource = data.data() as Resource;
          if (resourceToDelete.resource_type === "url") {
            resourceFound
              .delete()
              .then(() => {
                console.log("RESOURCE HAS BEEN REMOVED !!!!!");
                this.updatingUnitClassValues(
                  teacher,
                  activeSubject,
                  activeUnit,
                  activeClass
                );
              })
              .catch((reason) =>
                console.log("Error al intentar borrar: ", reason)
              );
          } else {
            this.afs
              .collection("essays")
              .doc(resourceToDelete.resource_url.replace("/essays/", ""))
              .collection("essay_items", (ref) => ref.limit(1))
              .get()
              .toPromise()
              .then((auxData) => {
                if (!auxData.empty) {
                  auxData.forEach((typePracticeAux) => {
                    const typePractice: TypePractice =
                      typePracticeAux.data() as TypePractice;
                    if (typePractice.useCount === undefined) {
                      typePractice.useCount = 0;
                    } else {
                      if (typePractice.useCount === 0) {
                        typePractice.useCount = 0;
                      } else {
                        typePractice.useCount = typePractice.useCount - 1;
                      }
                    }
                    typePracticeAux.ref
                      .update(typePractice)
                      .then(() => {
                        resourceFound
                          .delete()
                          .then(() => {
                            console.log("RESOURCE HAS BEEN REMOVED !!!!!");
                            this.updatingUnitClassValues(
                              teacher,
                              activeSubject,
                              activeUnit,
                              activeClass
                            );
                          })
                          .catch((reason) =>
                            console.log("Error al intentar borrar: ", reason)
                          );
                        return;
                      })
                      .catch((reason) => console.log("ERROR !!!! ", reason));
                    return;
                  });
                } else {
                  console.log("TYPE PRACTICE NOT FOUND !!!!!!!");
                }
              });
          }
        } else {
          console.log("RESOURCE NOT FOUNT");
        }
      })
      .catch((reason) =>
        console.log("ERROR AL INTENTAR ELIMINAR DATO: ", reason)
      );
  }

  public deleteEvaluationFromClass(
    teacher: Teacher,
    activeSubject,
    activeUnit,
    activeClass,
    evaluation
  ) {
    return this.afs
      .collection(
        `/cuenca/${teacher.teacher_unit_educational[0]}/planification/planification_parallels/parallels/${activeSubject.parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}/classes`
      )
      .doc(activeClass.class_id)
      .collection("evaluations")
      .doc(evaluation.evaluation_id)
      .delete();
  }

  public getEvaluationsFromUnitEducationalId(unit_educational_id: String) {
    return this.afs
      .collection("evaluations", (ref) =>
        ref.where("unit_educational_id_from_teacher", "==", unit_educational_id)
      )
      .valueChanges();
  }

  public updateStatusUnit(
    educationalUnitID: string,
    parallelID: string,
    subjectID: string,
    unitID: string,
    statusUnit: boolean
  ) {
    const unit = this.afs
      .collection("cuenca")
      .doc(educationalUnitID)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(parallelID)
      .collection("subjects")
      .doc(subjectID)
      .collection("units")
      .doc(unitID);
    unit
      .update({
        statusUnit: statusUnit,
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  // this.getEssaysFromClass(unitEducationalID, parallelID, subjectID, unitID, aux.data().class_id);
  // this.getEvaluationFromClass(unitEducationalID, parallelID, subjectID, unitID, aux.data().class_id);
  /**
   * Obtener Listado de UNidades.
   * ***/
  public getSubjectUnitList(
    unitEducationalID: string,
    parallelID: string,
    subjectID: string
  ) {
    const unitList = this.afs
      .collection("cuenca")
      .doc(unitEducationalID)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(parallelID)
      .collection("subjects")
      .doc(subjectID)
      .collection("units", (ref) => ref.where("statusUnit", "==", true));
    return unitList.get().toPromise();
  }

  /**
   * Obtener Listado de Ensayos
   * ***/
  public getEssaysFromClass(
    unitEducationalID: string,
    parallelID: string,
    subjectID: string,
    unitID: string,
    classID: string
  ) {
    const unitList = this.afs
      .collection("cuenca")
      .doc(unitEducationalID)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(parallelID)
      .collection("subjects")
      .doc(subjectID)
      .collection("units")
      .doc(unitID)
      .collection("classes")
      .doc(classID)
      .collection("resources", (ref) => {
        return ref
          .where("resource_type", "==", "essay")
          .where("resource_rubric", "==", true);
      });
    return unitList.get().toPromise();
  }

  /**
   * Obtener Listado de Evaluaciones.
   * ***/
  public getEvaluationFromClass(
    unitEducationalID: string,
    parallelID: string,
    subjectID: string,
    unitID: string,
    classID: string
  ) {
    const unitList = this.afs
      .collection("cuenca")
      .doc(unitEducationalID)
      .collection("planification")
      .doc("planification_parallels")
      .collection("parallels")
      .doc(parallelID)
      .collection("subjects")
      .doc(subjectID)
      .collection("units")
      .doc(unitID)
      .collection("classes")
      .doc(classID)
      .collection("evaluations");
    // return unitList.get().toPromise()
    unitList
      .get()
      .toPromise()
      .then((value) =>
        value.forEach((aux) => {
          console.log(aux.data());
        })
      )
      .catch((reason) => console.log("ERROR OBTENIENDO DATOS DE EVALUACIONES"));
  }

  // private getEssayValue() {
  //
  // }
}
