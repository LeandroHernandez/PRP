import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Studentdocum } from "../../models/class/class.documentstudent";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { UnitEducational } from "app/models/class/class.documentUnitEducational";
import { SendEmailService } from "../sendEmail/send-email.service";
import { Adminpractices } from "app/models/class/class.documentadminpractices";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private StudentCollection: AngularFirestoreCollection<Studentdocum>;
  public infoUser: UnitEducational;

  constructor(
    private db: AngularFirestore,
    public sendEmailService: SendEmailService,
    public afAuth: AngularFireAuth
  ) {
    this.StudentCollection = this.db.collection<Studentdocum>(`student`);
  }
  // public allstudent(unitEducationalId: String): Observable<any> {
  public allstudent(): Observable<any> {
    return this.db.collection("student").valueChanges();
  }
  public getstudent(student_id: string): Observable<any> {
    return this.StudentCollection.doc(`${student_id}`).valueChanges();
  }
  // public saveStudents(student: Studentdocum, unitEducationalId: string) {
  public saveStudents(student: Studentdocum) {
    student.student_enabled = true;
    if (student.student_parallel_id === "") {
      student.student_parallel_id = "";
      student.student_grade_id = "";
    }
    this.sendEmailService.sendEmeilConfirRegisterStudent(student);
    // student.student_unit_educational = unitEducationalId;
    // const collection = this.StudentCollection.doc(`${student.student_id}`);
    // return collection.set(student);
    return this.db.collection("student").add(student);
  }

  // public updateStudents(student: Studentdocum, unitEducationalId: string) {
  public updateStudents(student: Studentdocum) {
    student.student_enabled = true;
    if (student.student_parallel_id === "") {
      student.student_parallel_id = "";
      student.student_grade_id = "";
    }
    // this.sendEmailService.sendEmeilConfirRegisterStudent(student);
    // student.student_unit_educational = unitEducationalId;
    const collection = this.StudentCollection.doc(`${student.student_id}`);
    return collection.update({
      student_representant: student.student_representant,
      student_grade_id: student.student_grade_id,
      student_parallel_id: student.student_parallel_id,
      student_identification: student.student_identification,
      student_name: student.student_name,
      student_lastname: student.student_lastname,
      student_email: student.student_email,
      student_phone: student.student_phone,
      student_movil: student.student_movil,
      student_address: student.student_address,
      student_status: student.student_status,
    });
  }
  public deleteStudent(student: Studentdocum) {
    const collection = this.StudentCollection.doc(`${student.student_id}`);
    return collection.update({
      student_enabled: false,
      student_status: false,
    });
  }

  public finStudentByIdentification(
    identificationStudent: String
  ): Observable<any> {
    return this.db
      .collection("student", (ref) =>
        ref.where("student_identification", "==", identificationStudent)
      )
      .valueChanges();
  }

  public finStudentByEmail(studentEmail: String): Observable<any> {
    return this.db
      .collection("student", (ref) =>
        ref.where("student_email", "==", studentEmail)
      )
      .valueChanges();
  }

  public getClass(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string
  ): Observable<any> {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .valueChanges();
  }

  public getEntry(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string,
    resourceID: string
  ): Observable<any> {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .doc(resourceID)
      .collection("entry")
      .valueChanges();
  }

  public getEntrySnapshot(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string,
    resourceID: string
  ): Observable<any> {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .doc(resourceID)
      .collection("entry")
      .snapshotChanges();
  }

  public getPracticeDetail(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string,
    resourceID: string
  ) {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .doc(resourceID)
      .collection("entry")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Adminpractices;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public getEntryAttemptDetail(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string,
    resourceID: string,
    id_entry: String,
    practiceId: String
  ) {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .doc(resourceID)
      .collection("entry")
      .doc(`${id_entry}`)
      .collection("practiceAttempts")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Adminpractices;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public getDetailEntry(
    studentId: string,
    subjectId: string,
    unitId: string,
    classId: string,
    resourceID: string,
    id_entry: String,
    practiceId: String
  ) {
    return this.db
      .collection("student")
      .doc(studentId)
      .collection("subjects")
      .doc(subjectId)
      .collection("unit")
      .doc(unitId)
      .collection("class")
      .doc(classId)
      .collection("resources")
      .doc(resourceID)
      .collection("entry")
      .doc(`${id_entry}`)
      .collection("practiceAttempts")
      .doc(`${practiceId}`)
      .collection("attemptDetail")
      .valueChanges();
  }

  public blockStudent(
    studentID: string,
    student_enabled: boolean,
    studentEmail: string
  ) {
    const student = this.db.collection("student").doc(studentID);
    student
      .update({
        student_enabled: student_enabled,
      })
      .then(() => {
        const user = this.db.collection("users").doc(studentEmail);
        user
          .update({
            student_enabled: student_enabled,
          })
          .then(() => console.log("USER DISABLED COMPLETED !!!!"))
          .catch((reason) => console.log("ERROR DISABLED USER !!", reason));
      })
      .catch((reason) => console.log("STUDENT BLOCK ERROR !!!!!!", reason));
  }

  // .doc(`${practiceId}`).collection('attemptDetail')
}
