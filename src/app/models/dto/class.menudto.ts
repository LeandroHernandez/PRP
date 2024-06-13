import { Documentmenu } from '../class/class.documentmenu';
import { Documentsubmenu } from '../class/class.documentsubmenu';

export class Menudto {

    public menu: Documentmenu;
    public submenu: Array<Documentsubmenu>;

    constructor() {
        this.menu = new Documentmenu();
        this.submenu = new Array<Documentsubmenu>();
    }
}
