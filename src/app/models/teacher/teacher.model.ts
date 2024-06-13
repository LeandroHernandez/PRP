export class Teacher {
  teacher_id?: string;
  teacher_identification?: string;
  teacher_name?: string;
  teacher_surname?: string;
  teacher_email?: string;
  teacher_phone?: string;
  teacher_pass?: string;
  teacher_status?: boolean;
  teacher_unit_educational?: any;
  teacher_terms ?: boolean;

  constructor(teacherData: any) {
    this.teacher_id             = teacherData.teacher_id;
    this.teacher_identification = teacherData.teacher_identification;
    this.teacher_name           = teacherData.teacher_name;
    this.teacher_surname        = teacherData.teacher_surname;
    this.teacher_email          = teacherData.teacher_email;
    this.teacher_phone          = teacherData.teacher_phone;
    this.teacher_pass           = teacherData.teacher_pass;
    this.teacher_status         = true;
    this.teacher_unit_educational = teacherData.teacher_unit_educational;
    this.teacher_terms          = false;
  }
}
