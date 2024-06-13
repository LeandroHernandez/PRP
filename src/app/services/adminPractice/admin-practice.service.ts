import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {StorageService} from 'app/services/storage/storage.service';

/**MODELS */
import {Adminpractices} from 'app/models/class/class.documentadminpractices'
import {TypePractice} from 'app/models/class/class.documenttype-practice'
import {OptionOfItem} from '../../models/class/class.documenttype-practice';
import {Teacher} from 'app/models/teacher/teacher.model';
import {Rubric, RubricJudgement, RubricPoint} from '../../models/class/class.documentrubric';

@Injectable({
  providedIn: 'root'
})
export class AdminPracticeService {
  adminPracticeService: AngularFirestoreCollection<Adminpractices>

  constructor(private db: AngularFirestore,
              private storageService: StorageService) {
    this.adminPracticeService = this.db.collection<Adminpractices>('practices');
  }

  public getTypePractice() {
    return this.db.collection('type_practice').valueChanges();
  }

  public createPractice(practice: Adminpractices, isNew: boolean) {
    this.adminPracticeService.doc(practice.practice_id.toString()).set(practice);
  }


  uddateNamePractice(id_practic, practice_name) {
    this.adminPracticeService.doc(id_practic.toString()).update({'practice_name': practice_name});
  }

  public async createOptionPractice(practice_id: String, option: TypePractice, isNew: boolean) {
    const optionP = this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`);
    if (isNew) {
      await optionP.set(option);
    } else {
      optionP.update(option)
    }
  }

  public async createOptionItem(practice_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem[]): Promise<void> {
    arrayOptionOfItem.forEach(async optionOfItem => {
      try {
        optionOfItem.option_item_img_provisional = ''
        await this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`)
            .collection('options').doc(optionOfItem.option_item_id).set(optionOfItem);
      } catch (error) {
        console.log(error)
      }
    });
  }

  /*public async createItemsCopy(practice_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem[]): Promise<void> {
    arrayOptionOfItem.forEach(async optionOfItem => {
      try {
      //  optionOfItem.option_item_id = new Date().getTime().toString();
        await this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`)
          .collection('options').doc(optionOfItem.option_item_id).set(optionOfItem);
      } catch (error) {
        console.log(error)
      }
    });
  }*/
  public async createOptionItemCopy(practice_id: String, option: TypePractice, optionItem: OptionOfItem): Promise<void> {
    try {
      optionItem.option_item_img_provisional = ''
      await this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`)
          .collection('options').doc(optionItem.option_item_id).set(optionItem);
    } catch (error) {
      console.log(error)
    }
  }

  public deleteOptionItem(practice_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem) {
    this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`).collection('options').doc(arrayOptionOfItem.option_item_id).delete();
    if (arrayOptionOfItem.option_item_image) {
      this.storageService.deleteFileByURL(arrayOptionOfItem.option_item_image)
    }
  }

  public deleteOption(practice_id: String, option: TypePractice, arrayOfOption: OptionOfItem[]) {
    this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`).delete();
    if (option.question_image) {
      this.storageService.deleteFileByURL(option.question_image)
    }
    arrayOfOption.forEach(optionItem => {
      this.deleteOptionItem(practice_id, option, optionItem)
    })
  }

  public removeOptionWithoutItems(practice_id: String, option: TypePractice) {
    this.adminPracticeService.doc(`${practice_id}`).collection('items_practices').doc(`${option.option_id}`).delete();
    if (option.question_image) {
      this.storageService.deleteFileByURL(option.question_image)
    }
  }

  public deletePractice(practice_id: string) {
    return this.db.collection<Adminpractices>('practices').doc(practice_id).update({ 'public_status_practice': false, });
  }


  public getPractice(id_practic: String) {
    return this.db.collection<Adminpractices>('practices', ref => ref.where('practice_id', '==', id_practic)).valueChanges();
  }

  public getOptionPractice(practice: Adminpractices) {
    return this.adminPracticeService.doc(`${practice.practice_id}`).collection('items_practices').valueChanges();
  }

  public getOptionPracticeId(practiceId: String) {
    return this.adminPracticeService.doc(`${practiceId}`).collection('items_practices').valueChanges();
  }

  public getOptionsFromPractice(practiceId: String) {
    return this.adminPracticeService.doc(`${practiceId}`).collection('items_practices').valueChanges();
  }

  public getAllOptions(id_practic, item) {
    return this.adminPracticeService.doc(`${id_practic}`).collection('items_practices')
        .doc(item.option_id).collection('options').snapshotChanges();
  }

  public getAllOptionsFromOption(practiceId: String, option: TypePractice) {
    return this.adminPracticeService.doc(`${practiceId}`).collection('items_practices').doc(`${option.option_id}`)
        .collection('options').valueChanges();
  }

  public getOptionOfItems(practice: Adminpractices) {
    //    console.log(practice);
    return this.adminPracticeService.doc(`${practice.practice_id}`).collection('items_practices').valueChanges();
  }

  public getAllPractice() {
    return this.db.collection<Adminpractices>(
        'practices').valueChanges();
  }

  public getPracticeFromTeacherIdAndGradeId(unit_educational_id: String) {
    return this.db.collection('practices', ref => ref.where('unit_educational_id_from_teacher', '==', unit_educational_id))
        .valueChanges()

  }

  /********************************* METODOS DE EVALUACIÓN *******************************************************/
  public createEvaluation(evaluation: Adminpractices, isNew: boolean) {
    this.adminPracticeService.doc(evaluation.evaluation_id.toString()).set(evaluation);
  }

  public getEvaluation(evaluation_id: String) {
    return this.db.collection<Adminpractices>('practices', ref => ref.where('evaluation_id', '==', evaluation_id)).valueChanges();
  }

  public getOptionEvaluation(evaluation: Adminpractices) {
    return this.adminPracticeService.doc(`${evaluation.evaluation_id}`).collection('evaluation_items').valueChanges();
  }

  public async createOptionEvaluation(evaluation_id: String, option: TypePractice, isNew: boolean) {
    const optionP = this.adminPracticeService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`);
    if (isNew) {
      await optionP.set(option);
    } else {
      optionP.update(option)
    }
  }

  public updateEvaluation(evaluationId: String, data: Object) {
    this.adminPracticeService.doc(evaluationId.toString()).update(data);
  }

  public deleteOptionFromEvaluation(evaluation_id: String, option: TypePractice, arrayOfOption: OptionOfItem[]) {
    this.adminPracticeService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`).delete();
    if (option.question_image) {
      this.storageService.deleteFileByURL(option.question_image)
    }
    arrayOfOption.forEach(optionItem => {
      this.deleteOptionItem(evaluation_id, option, optionItem)
    })
  }

  public deleteOptionItemFromEvaluation(evaluation_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem) {
    this.adminPracticeService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`).collection('options').doc(arrayOptionOfItem.option_item_id).delete();
    if (arrayOptionOfItem.option_item_image) {
      this.storageService.deleteFileByURL(arrayOptionOfItem.option_item_image)
    }
  }

  public async createOptionItemEvaluation(evaluation_id: String, option: TypePractice, arrayOptionOfItem: OptionOfItem[]): Promise<void> {
    arrayOptionOfItem.forEach(async optionOfItem => {
      try {
        optionOfItem.option_item_img_provisional = ''
        await this.adminPracticeService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`)
            .collection('options').doc(optionOfItem.option_item_id).set(optionOfItem);
      } catch (error) {
        console.log(error)
      }
    });
  }

  public async createQuestionEvaluation(evaluation_id: String, option: TypePractice, isNew: boolean) {
    const optionP = this.adminPracticeService.doc(`${evaluation_id}`).collection('evaluation_items').doc(`${option.option_id}`);
    if (isNew) {
      await optionP.set(option);
    } else {
      optionP.update(option)
    }
  }
}
