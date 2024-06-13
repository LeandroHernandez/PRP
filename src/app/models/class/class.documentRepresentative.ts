export class Representativedocum {
    representative_id? : string;
    representative_identification? : string;
    representative_name? : string;
    representative_lastname? : string;
    representative_surname? : string;
    representative_email? : string;
    representative_phone? : string;
    representative_movil? : string;
    representative_address? : string;
    representative_password? : string;
    representative_pass1? : string;
    representative_status? : boolean;
    representative_student? : string;
    representative_unit_educational?: Array<string>;
     constructor( Representativedocum: any){
         this.representative_identification = Representativedocum.identification;
         this.representative_id = Representativedocum.id;
         this.representative_name = Representativedocum.name;
         this.representative_lastname = Representativedocum.lastname; 
         this.representative_surname = Representativedocum.surname; 
         this.representative_email = Representativedocum.email;
         this.representative_phone = Representativedocum.phone;
         this.representative_movil = Representativedocum.movil;
         this.representative_address = Representativedocum.address;
         this.representative_password = Representativedocum.password;
         this.representative_pass1 = Representativedocum.pass1;
         this.representative_status = Representativedocum.status;
         this.representative_student = Representativedocum.student;
        this.representative_unit_educational = Representativedocum.representative_unit_educational;
     }
 }