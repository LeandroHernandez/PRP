export class Studentdocum {
    student_id?: string;
    student_identification?: string;
    student_name?: string;
    student_lastname?: string;
    student_email?: string;
    student_phone?: string;
    student_movil?: string;
    student_address?: string;
    student_pass?: string;
    student_status?: boolean;
    student_level_id?: string;
    student_sublevel_id?: string;
    student_grade_id?: string;
    student_parallel_id?: string;
    student_unit_educational?: string;
    student_representant?: string;
    student_enabled?: boolean;

    constructor(Studentdocum: any) {
        this.student_identification = Studentdocum.identification;
        this.student_id = Studentdocum.id;
        this.student_name = Studentdocum.name;
        this.student_lastname = Studentdocum.lastname;
        this.student_email = Studentdocum.email;
        this.student_phone = Studentdocum.phone;
        this.student_movil = Studentdocum.movil;
        this.student_address = Studentdocum.address;
        this.student_pass = Studentdocum.password;
        this.student_status = Studentdocum.status;
        this.student_level_id = Studentdocum.level_id;
        this.student_sublevel_id = Studentdocum.sublevel_id;
        this.student_grade_id = Studentdocum.grade_id;
        this.student_parallel_id = Studentdocum.parallel_id;
        this.student_unit_educational = Studentdocum.unit_educational
        this.student_representant = Studentdocum.student_representant
    }
}
