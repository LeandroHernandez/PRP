import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import 'firebase/firestore';
import * as firebase from 'firebase/app';
import {FileItem} from '../../models/class/class.file-item';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  private CARPETA_IMAGENES = '/external_resourses/uploaded_files/attached_files';
  storage = firebase.storage();

  constructor(public db: AngularFirestore) {
  }

  uploadItems(imagenes: FileItem[], urls: any[], subject, activeUnit) {
    console.log(subject.parallel_id);

    if ( urls.length > 0) {
      urls.forEach( url => { 
        const id = new Date().getTime().toString()
        this.saveURL({
          id_subject: subject.subject_id,
          id_grade: subject.grade_id,
          id_parallel: subject.parallel_id,
          unit_id: activeUnit.unit_id,
          resource_id: id,
          url
        });
      })
    }

    if ( imagenes.length > 0) {
      const storageRed = firebase.storage().ref();
      for (const item of imagenes) {
        item.estaSubiendo = true;
        if (item.progreso >= 100) {
          continue;
        }

        const uploadTask: firebase.storage.UploadTask = storageRed.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
            .put(item.archivo);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            (error) => console.error(`Error: ${error}`),
            () => {
              console.log('Imagen cargada correctamente');
              item.url = 'gs://dydactico.appspot.com' + `${this.CARPETA_IMAGENES}/` + item.nombreArchivo;
              item.estaSubiendo = false;
              const id_item = new Date().getTime().toString()
              this.saveItem({
                id_subject: subject.subject_id,
                id_grade: subject.grade_id,
                id_parallel: subject.parallel_id,
                nombre: item.nombreArchivo,
                unit_id: activeUnit.unit_id,
                resource_id: id_item,
                url: item.url
              });
            }
        );
      }
    }
  }

  private saveItem(imagen) {
    this.storage.refFromURL(imagen.url).getDownloadURL()
        .then((url) => {
          imagen.url = url;
          this.db.collection(`${this.CARPETA_IMAGENES}`).doc(`${imagen.resource_id}`).set(imagen)
        });
  }

  private saveURL(url) {
    this.db.collection('/external_resourses/uploaded_files/urls').doc(`${url.resource_id}`).set(url);
  }
}
