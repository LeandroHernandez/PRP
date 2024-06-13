import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StorageService } from 'app/services/storage/storage.service';
import { Adminpractices } from 'app/models/class/class.documentadminpractices';
import { TypePractice, OptionOfItem } from 'app/models/class/class.documenttype-practice';
import { InformationEvaluationQuestion } from 'app/models/class/class.document-informationPracticeQuestion'
import { Subject } from 'app/models/class/classdocumentSubject';
import { EvaluationSummary} from 'app/models/class/evaluation-summary';
import { Entry } from '../../models/dto/class.entry';
@Injectable({
  providedIn: 'root'
})

export class AdminEvaluationService {
  adminEvaluationService: AngularFirestoreCollection<Adminpractices>
  constructor(private db: AngularFirestore,
    private storageService: StorageService) {
    this.adminEvaluationService = this.db.collection<Adminpractices>('evaluations');
  }

  public createEvaluation(evaluation: Adminpractices, isNew: boolean) {
    this.adminEvaluationService.doc(evaluation.evaluation_id.toString()).set(evaluation);
  }

  public getEvaluation(evaluation_id: String) {
    return this.db.collection<Adminpractices>('evaluations', ref => ref.where('evaluation_id', '==', evaluation_id)).valueChanges();
  }

  public getOptionEvaluation(evaluation: Adminpractices) {
    return this.adminEvaluationService.doc(`${evaluation.evaluation_id}`).collection('evaluation_items').valueChanges();
  }

  public async createOptionEvaluation(evaluation_id: String, option: TypePractice, isNew: boolean) {
    const optionP = this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`);
    if (isNew) {
      await optionP.set(option);
    } else {
      optionP.update(option)
    }
  }
  public getAllOptions(evaluation_id: String, item) {
    return this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items')
    .doc(item.option_id).collection('options').snapshotChanges();
  }
  public getAllOptionsFromOption(evaluation_id: String, option: TypePractice) {
    return this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`)
        .collection('options').valueChanges();
  }

  public updateEvaluation(evaluationId: String, data: Object) {
    this.adminEvaluationService.doc(evaluationId.toString()).update(data);
  }

  public deleteOptionFromEvaluation(evaluation_id: String, option: TypePractice, arrayOfOption: OptionOfItem[]) {
    this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`).delete();
    if (option.question_image) {
      this.storageService.deleteFileByURL(option.question_image)
    }
    arrayOfOption.forEach(optionItem => {
      this.deleteOptionItem(evaluation_id, option, optionItem)
    })
  }
  public deleteOptionItem(evaluation_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem) {
    this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items')
      .doc(`${option.option_id}`).collection('options').doc(arrayOptionOfItem.option_item_id).delete();
    if (arrayOptionOfItem.option_item_image) {
      this.storageService.deleteFileByURL(arrayOptionOfItem.option_item_image)
    }
  }
  public deleteOptionItemFromEvaluation(evaluation_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem) {
    this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`)
      .collection('options').doc(arrayOptionOfItem.option_item_id).delete();
    if (arrayOptionOfItem.option_item_image) {
      this.storageService.deleteFileByURL(arrayOptionOfItem.option_item_image)
    }
  }
  public async createOptionItemEvaluation(evaluation_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem[]): Promise<void> {
    arrayOptionOfItem.forEach(async optionOfItem => {
      try {
        optionOfItem.option_item_img_provisional = ''
        await this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`)
          .collection('options').doc(optionOfItem.option_item_id).set(optionOfItem);
      } catch (error) {
      }
    });
  }
  public async createQuestionEvaluation(evaluation_id: String, option: TypePractice, isNew: boolean) {
    const optionP = this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`);
    if (isNew) {
      await optionP.set(option);
    } else {
      optionP.update(option)
    }
  }
  public getTypePractice() {
    return this.db.collection('type_practice').valueChanges();
  }
  public removeOptionWithoutItems(evaluation_id: String, option: TypePractice) {
    this.adminEvaluationService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`).delete();
    if (option.question_image) {
      this.storageService.deleteFileByURL(option.question_image)
    }
  }

  public getEvaluationsFromSubjectAndGradeId(unit_educational_id: String) {
    return this.db.collection('evaluations', ref => ref.where('unit_educational_id_from_teacher', '==', unit_educational_id)).valueChanges()
  }
  public getOptionsFromEvaluations(evaluations_id: String) {
    console.log(evaluations_id);
    
    return this.adminEvaluationService.doc(`${evaluations_id}`).collection('evaluation_items').valueChanges();
  }
  public saveInformationQuestionFromStudent(student_id: String, subject_id:String, unit_id: String, class_id: String, evaluation: InformationEvaluationQuestion) {
    this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
    .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluation.evaluationId}`).collection('questions').doc(`${evaluation.questionId}`).set(evaluation)
  }
  public saveSubjectInformation(student_id: String, subject: Subject) {
    this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject.subject_id}`).set(subject);
  }
  /*public saveEvaluationInformation(student_id: String, subject:Subject, unit_id: String, class_id: String,evaluation_id: String,evaluationSummary: EvaluationSummary) {
    this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject.subject_id}`).collection('unit').doc(`${unit_id}`)
    .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluation_id}`).set(evaluationSummary);
    this.saveSubjectInformation(student_id, subject)
  //  this.saveInformationClass(student_id,subject, unit_id, class_id)
  }*/
  public saveEvaluationInformation(student_id: String, subject: Subject, unit_id: String, class_id: String, evaluationSummary: EvaluationSummary, isUpdate: Boolean) {
    console.log(evaluationSummary)
    if (!isUpdate) {
      this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject.subject_id}`).collection('unit').doc(`${unit_id}`)
      .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluationSummary.evaluationId}`).set(evaluationSummary);
      this.saveSubjectInformation(student_id, subject)
    } else if (isUpdate) {
      this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject.subject_id}`).collection('unit').doc(`${unit_id}`)
      .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluationSummary.evaluationId}`).update(evaluationSummary);
    }
  }
  public saveInformationClass(student_id: String, subject:Subject, unit_id: String, class_id: String) {
    const classe = {
      'class_id': class_id
    }
    this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject.subject_id}`).collection('unit').doc(`${unit_id}`)
    .collection('class').doc(`${class_id}`).set(classe)
  }
  public deleteEvaluation(evaluation_id: string) {
    return this.db.collection<Adminpractices>('evaluations').doc(evaluation_id).update({ 'public_status_practice': false, });
  }

  public getDetailsEvaluation(student_id: String, subject_id:String, unit_id: String, class_id: String, evaluation) {
    //  console.log(evaluation);
    if (evaluation.evaluationId === undefined) {
      return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
      .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluation.evaluationData[0].evaluation_id}`).collection('questions').valueChanges()
     } else {
      return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
      .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluation.evaluationId}`).collection('questions').valueChanges()
     }
  
  }

  public getDetailsRepEvaluation(student_id: String, subject_id:String, unit_id: String, class_id: String, evaluation: EvaluationSummary) {
    return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
     .collection('class').doc(`${class_id}`).collection('evaluation').valueChanges()
 }
   public getPracticeDetails(student_id: String, subject_id:String, unit_id: String, class_id: String, resource)  {
    return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
     .collection('class').doc(`${class_id}`).collection('resources').doc(`${resource.resource_id}`).collection('entry').doc(resource.id).collection('practiceAttempts')
     .snapshotChanges();
    }

    public  getpracticeAttempts(student_id: String, subject_id:String, unit_id: String, class_id: String, resource,practiceAttemptsId: string )  {
      return this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
      .collection('class').doc(`${class_id}`).collection('resources').doc(`${resource.resource_id}`).collection('entry').doc(resource.id)
      .collection('practiceAttempts').doc(practiceAttemptsId).collection('attemptDetail').valueChanges();
    }


  public activeEvaluation(student_id: String, subject_id:String, unit_id: String, class_id: String, evaluation: EvaluationSummary) {
    evaluation.evaluationStatus = false
    this.db.collection('student').doc(`${student_id}`).collection('subjects').doc(`${subject_id}`).collection('unit').doc(`${unit_id}`)
    .collection('class').doc(`${class_id}`).collection('evaluation').doc(`${evaluation.evaluationId}`).update(evaluation)
  }
}
