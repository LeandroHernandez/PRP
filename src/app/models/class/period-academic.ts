export class PeriodAcademic {
    academic_year_name:   string;
    academic_year_id:     string;
    academic_year_start:  Date;
    academic_year_status: boolean;
    academic_year_end:    Date;
    educational_unit_id:  string;
    constructor(period: any) {
        this.academic_year_name = period.academic_year_name;
        this.academic_year_id = period.academic_year_id;
        this.academic_year_start = period.academic_year_start;
        this.academic_year_status = period.academic_year_status;
        this.academic_year_end = period.academic_year_end;
        this.educational_unit_id = period.educational_unit_id;
    }
}
