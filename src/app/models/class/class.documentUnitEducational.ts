export class UnitEducational {
    unit_educational_id?: string;
    unit_educational_name?: string;
    unit_educational_address?: string;
    unit_educational_phone?: string;
    unit_educational_email?: string;
    unit_educational_academy?: string;
    unit_educational_country?: string;
    unit_educational_city?: string;
    unit_educational_logo?: string;
    unit_educational_status?: boolean;
    unit_educational_password?: string;
    unit_educational_Confirmpassword?: string;
    unit_educational_ruc?: string;
    unit_educational_product?: string;
    unit_educational_value?: number;
    unit_educational_emailBill?: string;
    unit_educational_phoneBill?: string;
    

    constructor(unit_educational: any) {
        this.unit_educational_id = unit_educational.id;
        this.unit_educational_name = unit_educational.name;
        this.unit_educational_address = unit_educational.address;
        this.unit_educational_phone = unit_educational.phone;
        this.unit_educational_email = unit_educational.email;
        this.unit_educational_academy = unit_educational.plan;
        this.unit_educational_country = unit_educational.country;
        this.unit_educational_city = unit_educational.city;
        this.unit_educational_logo = unit_educational.logo;
        this.unit_educational_status = unit_educational.status;
        this.unit_educational_password = unit_educational.password;
        this.unit_educational_Confirmpassword = unit_educational.confirmPassword;
        this.unit_educational_emailBill = unit_educational.emailBill;
        this.unit_educational_phoneBill= unit_educational.unit_educational_phoneBill;
        this.unit_educational_product= unit_educational.product;
        this.unit_educational_value  = unit_educational.value;
        this.unit_educational_ruc = unit_educational.ruc;
    }
}
