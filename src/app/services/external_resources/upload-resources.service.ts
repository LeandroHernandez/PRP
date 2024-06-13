import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TextBook } from '../../models/external_resources/textbook.model';
import { Video } from '../../models/external_resources/video.model';

@Injectable({
  providedIn: 'root'
})
export class UploadResourcesService {

  textBookCollection: AngularFirestoreCollection<TextBook>
  constructor(private db: AngularFirestore) {
    this.textBookCollection = this.db.collection<TextBook>('textbooks');
  }

  /**
   * Get all textbooks
   * Lista todos los libros de texto
   */

  public getAllTextBooks() {
    return this.db.collection('external_resourses').doc('uploaded_files').collection<TextBook>(`textbooks`).valueChanges();

  }

  /**
   * save textbook
   * Guardar libros de texto
   */
  public saveTextBooks(textbook: TextBook) {
    const collection = this.db.collection(`external_resourses`).doc('uploaded_files').collection<TextBook>(`textbooks`);
    return collection.add(textbook)
  }

   /**
   * Get all videos
   * Lista todos los videos
   */
  public getAllVideos() {
    return this.db.collection(`external_resourses`).doc('uploaded_files').collection<Video>(`videos`).valueChanges();
  }

   /**
   * save video
   * Guardar video
   */
  public saveVideos(video) {
    const collection = this.db.collection(`external_resourses`).doc('uploaded_files').collection<Video>(`videos`);
    return collection.add(video)
  }
}
