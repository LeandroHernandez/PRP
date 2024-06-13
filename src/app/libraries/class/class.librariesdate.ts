export class Librariesdate {

    constructor(){}

    /**
     * Obtiene el Timestamp actual
     * Get the current Timestamp
     *
     * @returns {number}
     * @memberof Librariesdate
     */
    public get_timestamp_current() : number{

        let date = new Date();
        return date.getTime();

    }
}