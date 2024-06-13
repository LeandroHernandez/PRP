export class Student {
  student_id?: string;
  student_identification?: string;
  student_name?: string;
  student_lastname?: string;
  student_email?: string;
  student_phone?: string;
  student_pass?: string;
  student_representant?: string;
  student_status?: boolean;
  student_terms?: boolean;
  student_unit_educational ?: string;
  student_grade_id?: string;
  student_parallel_id?: string;

  constructor(studentData: any) {
    this.student_id             = studentData.student_id;
    this.student_identification = studentData.student_identification;
    this.student_name           = studentData.student_name;
    this.student_lastname        = studentData.student_lastname;
    this.student_email          = studentData.student_email;
    this.student_phone          = studentData.student_phone;
    this.student_pass           = studentData.student_pass;
    this.student_representant   = studentData.student_representant;
    this.student_status         = true;
    this.student_terms          = false;
    this.student_unit_educational = studentData.student_unit_educational;
    this.student_grade_id = studentData.student_grade_id;
    this.student_parallel_id = studentData.student_parallel_id;
  }
}
