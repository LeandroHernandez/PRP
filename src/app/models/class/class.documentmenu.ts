export class Documentmenu {

    public menu_uid : string;
    public menu_name : string;
    public menu_url : string;
    public menu_icon : string;
    public menu_state : boolean;
    public menu_rol_uid : string;

    constructor(){
        this.menu_uid = "";
        this.menu_name = "";
        this.menu_url = "";
        this.menu_icon = "";
        this.menu_rol_uid = "";
        this.menu_state = true;
    }

}