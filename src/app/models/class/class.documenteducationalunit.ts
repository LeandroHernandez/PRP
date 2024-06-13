export class Documenteducationalunit {

    public educational_unit_id : string;
    public educational_unit_name : string;
    public educational_unit_address : string;
    public educational_unit_telephone : string;
    public educational_unit_email : string;
    public educational_unit_number_of_students : number;
    public educational_unit_country : string;
    public educational_unit_city : string;
    public educational_unit_logo : string;
    public educational_unit_state : boolean;

    constructor(){
        this.educational_unit_id = "";
        this.educational_unit_name = "";
        this.educational_unit_address = "";
        this.educational_unit_telephone = "";
        this.educational_unit_email = "";
        this.educational_unit_number_of_students = 0;
        this.educational_unit_country = "";
        this.educational_unit_city = "";
        this.educational_unit_logo = "";
        this.educational_unit_state = false;
    }
}