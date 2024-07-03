export class Player {
    playerId?: string;
    identification?: string;
    firstName?: string;
    lastName?: string;
    birthdate?: string; // Fecha de nacimiento
    age?: number; // Edad
    educationalUnit?: string; // Unidad Educativa
    phone?: string;
    gender?: string; // Sexo
    level?: string; // Nivel
    address?: string; // Dirección
    status?:boolean;
    registrationDate?: string; //Fecha de registro del jugador al sistema

    constructor(playerData: any) {
        this.playerId = playerData.playerId;
        this.identification = playerData.identification;
        this.firstName = playerData.firstName;
        this.lastName = playerData.lastName;
        this.birthdate = playerData.birthdate;
        this.age = playerData.age;
        this.educationalUnit = playerData.educationalUnit;
        this.phone = playerData.phone;
        this.gender = playerData.gender;
        this.level = playerData.level;
        this.address = playerData.address;
        this.status = playerData.status;
        this.registrationDate= playerData.registrationDate;
    }
}
