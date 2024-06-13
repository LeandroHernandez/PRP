export class Listtext {
    text_id?: string;
    text_name?: string;
    text_unit?: string;
    text_cod?: string;
    text_level?: string;
    text_url?: string;
  
    constructor(textData: any) {
      this.text_id             = textData.text_id;
      this.text_name        = textData.text_name;
      this.text_unit      = textData.text_unit;
      this.text_cod      = textData.text_cod;
      this.text_level        = textData.text_level;
      this.text_url          = textData.text_url;
    }
     
}
