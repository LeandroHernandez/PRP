import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {ForumDocument} from '../../models/class/class.documentforo';
import {UnitEducational} from '../../models/class/class.documentUnitEducational';
import {Observable} from 'rxjs';
import {ForumQuestionDocument} from '../../models/class/class.documentforumquestion';
import {DocumentForumAnswer} from '../../models/class/class.documentforoanswer';

@Injectable({
    providedIn: 'root'
})
export class ForumServiceService {

    private forumDocumentAngularFirestoreCollection: AngularFirestoreCollection<ForumDocument>;
    public infoUser: UnitEducational;

    constructor(
        private db: AngularFirestore) {
        this.forumDocumentAngularFirestoreCollection = this.db.collection('forum')
    }

    /**
     * @param idUnitEducational: ID DEL COLEGIO DEL ESTUDIANTE
     * @param parallelId: ID DEL PARALELO AL QUE PERTENECE UN ESTUDIANTE
     * @param subjectId: ID DEL TEMA AL QUE ESTA ASIGNADO EL ESTUDIANTE
     * @param unitId: ID DE LA UNIDAD EN LA QUE ESTA REGISTRADO UN ESTUDIANTE
     * @param classesId: ID DE LA CLASE EN LA QUE ESTA EL ESTUDIANTE
     */
    public findForumClass(idUnitEducational: string, parallelId: string,
                          subjectId: string, unitId: string, classesId: string): Observable<any> {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(classesId)
            .valueChanges();
    }

    /**
     * METODO PARA CREAR UN FORO NUEVO EN UNA CLASE
     * @param idUnitEducational: ID DEL COLEGIO DEL ESTUDIANTE
     * @param parallelId: ID DEL PARALELO AL QUE PERTENECE UN ESTUDIANTE
     * @param subjectId: ID DEL TEMA AL QUE ESTA ASIGNADO EL ESTUDIANTE
     * @param unitId: ID DE LA UNIDAD EN LA QUE ESTA REGISTRADO UN ESTUDIANTE
     * @param forum: OBJETO DE TIPO FORO QUE VAMOS A ALMACENAR EN LA BD
     */
    public createForum(idUnitEducational: string, parallelId: string, subjectId: string,
                       unitId: string, forum: ForumDocument) {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(forum.forum_id)
            .set(forum);
    }

    /**
     *  Crea una pregunta para el foro
     * @param idUnitEducational
     * @param parallelId
     * @param subjectId
     * @param unitId
     * @param class_id
     * @param question objeto de tipo question para guardar en la DB
     */
    public createForumQuestion(idUnitEducational: string, parallelId: string, subjectId: string,
                               unitId: string, class_id: string, question: ForumQuestionDocument) {
        console.log(question)
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(class_id)
            .collection('question')
            .doc(question.question_id)
            .set(question);
    }

    public createForumQuestionStudent(idUnitEducational: string, parallelId: string, subjectId: string,
                                      unitId: string, class_id: string, question: ForumQuestionDocument) {
        console.log(question)
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(class_id)
            .collection('question')
            .doc(question.question_id)
            .set(Object.assign({}, question));
    }


    /**
     * METODO PARA OBTENER LAS PREGUNTASDE UN FORO
     * @param idUnitEducational
     * @param parallelId
     * @param subjectId
     * @param unitId
     * @param classesId
     */
    public getAllQuestionsForum(idUnitEducational: string, parallelId: string,
                                subjectId: string, unitId: string, classesId: string) {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(classesId)
            .collection('question')
            .valueChanges();
    }

    public getFilterQuestionsForum(idUnitEducational: string, parallelId: string,
                                   subjectId: string, unitId: string, classesId: string, filtro: string) {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(classesId)
            .collection('question', ref => ref.orderBy('question').startAt(`${filtro}`)).valueChanges();
    }


    /**
     * Registramos una nueva respuesta a Una Pregunta, luego de almacenar el dato procedemos a actualizar la
     * lista de vistos en la coleccion de preguntas llenandola unicamente con el id del usuario que registro pregunta
     * para habilitar la notificacion de mensaje no visto en la interfaz de los demas usuarios
     * @param idUnitEducational
     * @param parallelId
     * @param subjectId
     * @param unitId
     * @param forumID
     * @param forumQuestionDocument
     * @param documentForumAnswer
     */
    public saveContribution(idUnitEducational: string, parallelId: string, subjectId: string,
                            unitId: string, forumID: string, forumQuestionDocument: ForumQuestionDocument,
                            documentForumAnswer: DocumentForumAnswer) {
        try {
            this.forumDocumentAngularFirestoreCollection
                .doc(idUnitEducational)
                .collection('parallel')
                .doc(parallelId)
                .collection('subject')
                .doc(subjectId)
                .collection('units')
                .doc(unitId)
                .collection('classes')
                .doc(forumID)
                .collection('question')
                .doc(forumQuestionDocument.question_id)
                .collection('answers')
                .doc(documentForumAnswer.answer_id)
                .set(Object.assign({}, documentForumAnswer)).then(r => '')
            this.updateQuestionSawList(idUnitEducational, parallelId, subjectId, unitId, forumID,
                forumQuestionDocument, documentForumAnswer.answer_user_id)
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * actualizamos el objeto pregunta en el que acabamos de realizar un aporte, reuniciamos la lista de vistos
     * para que se muestre la notificacion en la interfaz de los demas usuarios o docente
     * @param idUnitEducational
     * @param parallelId
     * @param subjectId
     * @param unitId
     * @param forumID
     * @param forumQuestionDocument
     * @param userID
     * @private
     */
    private updateQuestionSawList(idUnitEducational: string, parallelId: string, subjectId: string,
                                  unitId: string, forumID: string, forumQuestionDocument: ForumQuestionDocument, userID: string) {
        forumQuestionDocument.studentAnswersList = []
        forumQuestionDocument.studentAnswersList.push(userID);
        const x = this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(forumID)
            .collection('question')
            .doc(forumQuestionDocument.question_id);
        x.update({
            studentAnswersList: forumQuestionDocument.studentAnswersList
        }).then(r => {
            console.log('Document successfully updated!');
        })
    }

    public addView(idUnitEducational: string, parallelId: string, subjectId: string,
                   unitId: string, forumID: string, forumQuestionDocument: ForumQuestionDocument) {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(forumID)
            .collection('question')
            .doc(forumQuestionDocument.question_id)
            .set(forumQuestionDocument);
    }


    public getAllAnswer(idUnitEducational: string, parallelId: string, subjectId: string,
                        unitId: string, forumID: string, forumQuestionDocument: ForumQuestionDocument) {
        return this.forumDocumentAngularFirestoreCollection
            .doc(idUnitEducational)
            .collection('parallel')
            .doc(parallelId)
            .collection('subject')
            .doc(subjectId)
            .collection('units')
            .doc(unitId)
            .collection('classes')
            .doc(forumID)
            .collection('question')
            .doc(forumQuestionDocument.question_id)
            .collection('answers')
            .valueChanges();
    }

    public addLikeContribution(idUnitEducational: string, parallelId: string, subjectId: string,
                               unitId: string, forumID: string, forumQuestionDocument: ForumQuestionDocument,
                               documentForumAnswer: DocumentForumAnswer, userLikedID: string) {
        try {
            documentForumAnswer.answer_count_like.push(userLikedID);
            this.forumDocumentAngularFirestoreCollection
                .doc(idUnitEducational)
                .collection('parallel')
                .doc(parallelId)
                .collection('subject')
                .doc(subjectId)
                .collection('units')
                .doc(unitId)
                .collection('classes')
                .doc(forumID)
                .collection('question')
                .doc(forumQuestionDocument.question_id)
                .collection('answers')
                .doc(documentForumAnswer.answer_id)
                .set(Object.assign({}, documentForumAnswer)).then(r => '')
            return true;
        } catch (e) {
            return false;
        }
    }
}
