import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, mergeMap, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }
  /**
 * Cargar archivo de imagen.
 * @param filePath
 * @param file
 */
  public uploadFile(filePath: string, file: File): Promise<string> {
    // console.log(filePath, file);
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);
    return task.snapshotChanges().pipe(
      last(),
      mergeMap(() => fileRef.getDownloadURL())
    ).toPromise();
  }


  public uploadFileV2(filePath: string, file: File) {
    return this.storage.upload(filePath, file);
  }

  public deleteFileByURL(fileURL: string): Promise<any> {
    return this.storage.storage.refFromURL(fileURL).delete();
  }

  public async getDownload() {
    const pathReference = this.storage.ref('TemplatesToImport/importTeachers/importTeacher.xlsx');
    const gsReference = this.storage.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/dydactico.appspot.com/o/%20TemplatesToImport%2FimportTeachers%2FimportTeacher.xlsx?alt=media&token=ba5c7bce-8c1b-472c-a317-57e280a218b2')
    console.log(gsReference);
    await gsReference.getDownloadURL().then(downloadURL => {
      const fileUrl = downloadURL;
      console.log(fileUrl)
      return fileUrl
    });
  }



}
