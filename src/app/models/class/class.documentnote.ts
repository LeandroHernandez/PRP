
export class Notesdocum {

    titulo?: string;
    contenido?: string;
    status?: boolean;


    constructor(notesdocum: any) {
        this.titulo = notesdocum.titulo;
        this.contenido = notesdocum.contenido;
        this.status = notesdocum.status;
    }
}
