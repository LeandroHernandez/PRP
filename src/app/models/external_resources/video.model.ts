export class Video {
    competencies?: string;
    grade_name?: string;
    id_grade?: string;
    id_subject?: string;
    subject_name?: string;
    title?: string;
    type?: string;
    url?: string;
    constructor(videoData: any) {
        this.competencies = videoData.competencies;
        this.grade_name = videoData.grade_name;
        this.id_grade = videoData.id_grade;
        this.id_subject = videoData.id_subject;
        this.subject_name = videoData.subject_name;
        this.title = videoData.title;
        this.type = videoData.type;
        this.url = videoData.url;
    }
}
