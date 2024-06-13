import { Component, OnInit } from '@angular/core';
import { ForumQuestionDocument } from 'app/models/class/class.documentforumquestion';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forumQuestionDocumentList = [];
  forumAnswerDocumentList = [];
  constructor() { }

  ngOnInit(): void {
    this.forumQuestionDocumentList = [
      {
        question_id: '123456',
        question: 'string',
        id_user_creator: '13246',
        question_date: 'string',
        question_time: 'string',
        user_type: 'string',
        question_status: true,
      },
      {
        question_id: '1234561551',
        question: 'number',
        id_user_creator: '13246',
        question_date: 'string',
        question_time: 'string',
        user_type: 'string',
        question_status: true,
      }
    ];
    this.forumAnswerDocumentList = [
      {
        answer: 'Respuesta a la Pregunta',
        answer_id: '1597076037326',
        answer_status: true,
        answer_user_name: 'Jeans (E) Rodriguez Rodriguez',
        answer_user_type: 'estudiante',
      },
      {
        answer: '2 Respuesta a la Pregunta',
        answer_id: '1597076037326',
        answer_status: true,
        answer_user_name: 'Jeans (E) Rodriguez Rodriguez',
        answer_user_type: 'estudiante',
      }
    ]
  }
}
