export class RepresentedStudentdocum {
    student_grade_id?: string;
    student_id?: string;
    student_lastname?: string;
    student_name?: string;
    student_parallel_id?: string;
    representative_id?: string;

    constructor(representedStudentdocum: any) {
        this.student_grade_id = representedStudentdocum.grade_id;
        this.student_id = representedStudentdocum.student_id;
        this.student_lastname = representedStudentdocum.lastname;
        this.student_name = representedStudentdocum.name;
        this.student_parallel_id = representedStudentdocum.parallel_id;
        this.representative_id = representedStudentdocum.representative_id;
    }
}
