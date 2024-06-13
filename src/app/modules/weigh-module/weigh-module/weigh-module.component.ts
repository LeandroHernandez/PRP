import {Component, OnInit} from '@angular/core';
import {Teacher} from '../../../models/teacher/teacher.model';
import {WeighServicesService} from '../../../services/weighservice/weigh-services.service';
import {ParallelIdObjectDTO} from '../../../models/dto/pesos/ParallelIdObjectDTO';
import {Parallels} from '../../../models/class/classdocument-parallels';
import {Subject} from '../../../models/class/classdocumentSubject';
import {WeightUnitObjectDTO} from '../../../models/dto/pesos/WeightUnitObjectDTO';
import {WeightClassObjectDTO} from '../../../models/dto/pesos/WeightClassObjectDTO';
import {WeightComponentsObjectDTO} from '../../../models/dto/pesos/WeightComponentsObjectDTO';
import {StudentWeighDTO} from '../../../models/dto/pesos/StudentWeighDTO';
import {StudentScoreUnitDetailDTO} from '../../../models/dto/pesos/StudentScoreUnitDetailDTO';
import {StudentScoreClassDetailDTO} from '../../../models/dto/pesos/StudentScoreClassDetailDTO';
import {StudentScoreComponentDetailDTO} from '../../../models/dto/pesos/StudentScoreComponentDetailDTO';

@Component({
    selector: 'app-weigh-module',
    templateUrl: './weigh-module.component.html',
    styleUrls: ['./weigh-module.component.css']
})
export class WeighModuleComponent implements OnInit {
    private infoUser: Teacher;
    public parallelsList: Parallels[] = [];
    public subjectsList: Subject[] = [];
    public parallelSelected: Parallels;
    public subjectSelected: Subject;
    public weightUnitObjectDTOList: WeightUnitObjectDTO[] = [];
    public studentWeighDTOList: StudentWeighDTO[] = [];
    public contComponents = 0;

    constructor(private weightService: WeighServicesService) {
    }

    ngOnInit(): void {
        this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
        this.getParallelInfo()
    }

    private getParallelInfo() {
        this.weightService
            .getTeacherParallelsIDList(this.infoUser.teacher_id, this.infoUser.teacher_unit_educational[0])
            .then(auxData => {
                if (!auxData.empty) {
                    const parallelIDDTOList: ParallelIdObjectDTO[] = [];
                    auxData.forEach(parallelAux => {
                        const parallelDTO: ParallelIdObjectDTO = parallelAux.data() as ParallelIdObjectDTO;
                        parallelIDDTOList.push(parallelDTO)
                    });
                    this.getParallelObject(parallelIDDTOList);
                } else {
                    console.log('DATA NOT FOUND !!!!');
                }
            }).catch(reason => console.log('ERROR GETTING DATA !!! ', reason));
    }

    private getParallelObject(parallelIDDTOList: ParallelIdObjectDTO[]) {
        this.parallelsList = [];
        for (const parallelIDObjectDTO of parallelIDDTOList) {
            this.weightService
                .getUnitEducationalParallelList(this.infoUser.teacher_unit_educational[0], parallelIDObjectDTO.parallel_id)
                .then(auxData => {
                    if (auxData.exists) {
                        const parallel: Parallels = auxData.data() as Parallels;
                        this.parallelsList.push(parallel);
                    }
                }).catch(reason => console.log('ERROR GETTING PARALLELS DATA !!!!! ', reason))
        }
    }

    public OnChangeParallel(e) {
        const position: number = e.target.value as number;
        this.parallelSelected = this.parallelsList[position];
        this.getTeacherSubjects();
    }

    private getTeacherSubjects() {
        this.subjectsList = [];
        if (this.parallelSelected !== undefined) {
            this.weightService
                .getTeacherSubject(this.infoUser.teacher_id, this.infoUser.teacher_unit_educational[0], this.parallelSelected.parallel_id)
                .then(auxData => {
                    if (!auxData.empty) {
                        auxData.forEach(subjectsDataAux => {
                            const subject: Subject = subjectsDataAux.data() as Subject;
                            this.subjectsList.push(subject);
                        });
                    } else {
                        console.log('SUBJECTS DATA NOT FOUND !!!!!')
                    }
                }).catch(reason => console.log('ERROR GETTING SUBJECTS DATA !!!! ', reason));
        }
    }

    public onChangeSubject(e) {
        const position: number = e.target.value as number;
        this.subjectSelected = this.subjectsList[position];
    }

    public initGeneration() {
        this.weightUnitObjectDTOList = [];
        this.studentWeighDTOList = [];
        const unitEducationalID = this.infoUser.teacher_unit_educational[0];
        const parallelID = this.parallelSelected.parallel_id;
        const subjectID = this.subjectSelected.subject_id;
        this.findStudentsData(unitEducationalID, parallelID);
        this.weightService.getSubjectUnitList(unitEducationalID, parallelID, subjectID)
            .then(unitList => {
                unitList.forEach(unitListAux => {
                    if (unitListAux.data().weighSum !== undefined) {
                        if (unitListAux.data().weighSum > 0) {
                            const weightUnitObjectDTO: WeightUnitObjectDTO = new WeightUnitObjectDTO();
                            weightUnitObjectDTO.unitID = unitListAux.data().unit_id
                            weightUnitObjectDTO.unitName = unitListAux.data().unitName
                            weightUnitObjectDTO.unitWeight = unitListAux.data().pUnit
                            weightUnitObjectDTO.weightClassObjectDTOList = []
                            this.weightUnitObjectDTOList.push(weightUnitObjectDTO);
                        }
                    }
                });
                for (const unitDTO of this.weightUnitObjectDTOList) {
                    const weightClassObjectDTOList: WeightClassObjectDTO[] = []
                    this.weightService.getClassUnitList(unitEducationalID, parallelID, subjectID, unitDTO.unitID)
                        .then(classUnitList => {
                            classUnitList.forEach(classUnitListAux => {
                                const weightClassObjectDTO: WeightClassObjectDTO = new WeightClassObjectDTO();
                                weightClassObjectDTO.classID = classUnitListAux.data().class_id;
                                weightClassObjectDTO.className = classUnitListAux.data().className;
                                weightClassObjectDTO.classComponentWeightSum = classUnitListAux.data().weighSum;
                                weightClassObjectDTO.weightComponentsObjectDTOList = [];
                                weightClassObjectDTOList.push(weightClassObjectDTO);
                            });
                            for (const classDTO of weightClassObjectDTOList) {
                                const weightComponentsObjectDTOList: WeightComponentsObjectDTO[] = [];
                                this.weightService
                                    .getEssaysFromClass(unitEducationalID, parallelID, subjectID, unitDTO.unitID, classDTO.classID)
                                    .then(essay => {
                                        essay.forEach(essayAux => {
                                            const weightComponentsObjectDTO: WeightComponentsObjectDTO = new WeightComponentsObjectDTO();
                                            weightComponentsObjectDTO.componentID = essayAux.data().resource_id;
                                            weightComponentsObjectDTO.componentType = essayAux.data().resource_type;
                                            weightComponentsObjectDTO.componentWeight = essayAux.data().evaluation_peso;
                                            weightComponentsObjectDTO.componentResourceID = essayAux.data().resource_url.replace('/essays/', '');
                                            this.weightService
                                                .getValueFromEssay(weightComponentsObjectDTO.componentResourceID)
                                                .then(essayValueAux => {
                                                    essayValueAux.forEach(result => {
                                                        weightComponentsObjectDTO.componentValue = result.data().question_scoring;
                                                        weightComponentsObjectDTOList.push(weightComponentsObjectDTO);
                                                        this.findStudentsScoreDetail(subjectID, unitDTO.unitID, classDTO.classID,
                                                            essayAux.data().resource_id, weightComponentsObjectDTO.componentWeight,
                                                            weightComponentsObjectDTO.componentValue, classDTO.classComponentWeightSum,
                                                            unitDTO.unitWeight, 'essays');
                                                        return
                                                    });
                                                });
                                        });
                                        classDTO.weightComponentsObjectDTOList = weightComponentsObjectDTOList;
                                    }).catch(reason => console.log('ERROR OBTENIENDO DATOS DE ENSAYOS', reason));
                                //    AGREGAR EVALUACIONES

                                this.weightService
                                    .getEvaluationFromClass(unitEducationalID, parallelID, subjectID, unitDTO.unitID, classDTO.classID)
                                    .then(essay => {
                                        essay.forEach(essayAux => {
                                            const weightComponentsObjectDTO: WeightComponentsObjectDTO = new WeightComponentsObjectDTO();
                                            weightComponentsObjectDTO.componentID = essayAux.data().evaluation_id;
                                            weightComponentsObjectDTO.componentType = essayAux.data().evaluation_type;
                                            weightComponentsObjectDTO.componentWeight = essayAux.data().evaluation_peso;
                                            weightComponentsObjectDTO.componentResourceID = essayAux.data().evaluation_url.replace('/evaluation/', '');
                                            this.weightService
                                                .getValueFromEvaluation(weightComponentsObjectDTO.componentResourceID)
                                                .then(essayValueAux => {
                                                    weightComponentsObjectDTO.componentValue = 0
                                                    if (essayValueAux.exists) {
                                                        weightComponentsObjectDTO.componentValue = essayValueAux.data().evaluation_scoring
                                                    }
                                                    weightComponentsObjectDTOList.push(weightComponentsObjectDTO);
                                                    this.findStudentsScoreDetail(subjectID, unitDTO.unitID, classDTO.classID,
                                                        essayAux.data().evaluation_id, weightComponentsObjectDTO.componentWeight,
                                                        weightComponentsObjectDTO.componentValue, classDTO.classComponentWeightSum,
                                                        unitDTO.unitWeight, 'evaluation');
                                                    return
                                                });
                                        });
                                        classDTO.weightComponentsObjectDTOList = weightComponentsObjectDTOList;
                                    }).catch(reason => console.log('ERROR OBTENIENDO DATOS DE ENSAYOS', reason));
                            }
                            unitDTO.weightClassObjectDTOList = weightClassObjectDTOList;
                        }).catch(reason => console.log('ERROR OBTENIENDO DATOS DE CLASES', reason));
                }
            })
            .catch(reason => {
                console.log('ERROR OBTENIENDO DATOS DE UNIDADES !!!!!! ', reason);
            });
    }

    public dataSelected() {
        return !(this.parallelSelected !== undefined && this.subjectSelected !== undefined);
    }

    public getHeaderSize(weightUnitObjectDTO: WeightUnitObjectDTO): number {
        let cont = 0;
        for (const auxWeighUnitDTO of weightUnitObjectDTO.weightClassObjectDTOList) {
            cont = cont + auxWeighUnitDTO.weightComponentsObjectDTOList.length;
        }
        return cont;
    }


    private findStudentsData(unitEducationalID: any, parallelID: string) {
        this.weightService.findStudents(unitEducationalID, parallelID)
            .then(studentAuxList => {
                if (!studentAuxList.empty) {
                    studentAuxList.forEach(result => {
                        const studentWeighDTO: StudentWeighDTO = new StudentWeighDTO();
                        studentWeighDTO.studentID = result.data().student_id;
                        studentWeighDTO.studentName = result.data().student_name + ' ' + result.data().student_lastname;
                        studentWeighDTO.studentScoreDetailDTOList = []
                        this.studentWeighDTOList.push(studentWeighDTO);
                    });
                } else {
                    console.log('STUDENT DATA NOT FOUND !!!!');
                }
            })
            .catch(reason => console.log('ERROR GETTING STUDENT DATA !!!', reason))
    }

    private findStudentsScoreDetail(subjectID: string, unitID: string, classID: string,
                                    resourceID: string, componentWeigh: number, componentValue: number, classWeight: number,
                                    unitWeight: number, type: string) {


        for (const studentWeighDTO of this.studentWeighDTOList) {
            this.weightService
                .getScoring(studentWeighDTO.studentID, subjectID, unitID, classID, resourceID, type)
                .then(value => {
                    let scoreObtained = 0
                    if (value.exists) {
                        if (value.data().qualification !== undefined) {
                            if (type === 'essays' ) {
                                scoreObtained = value.data().qualification;
                            }
                        }
                        if (value.data().totalScore !== undefined) {
                            if (type !== 'essays' ) {
                                scoreObtained = value.data().totalScore;
                            }
                        }
                    }
                    const studentScoreUnitDetailDTO: StudentScoreUnitDetailDTO = this.initUnitDetailDTO(unitID, classID, resourceID,
                        componentValue, componentWeigh, scoreObtained, classWeight, unitWeight);
                    if (studentWeighDTO.studentScoreDetailDTOList === undefined) {
                        studentWeighDTO.studentScoreDetailDTOList = [];
                        studentWeighDTO.studentScoreDetailDTOList
                            .push(studentScoreUnitDetailDTO);
                    } else {
                        const unitIndex = this.findUnitDetailDTO(studentScoreUnitDetailDTO.unitID,
                            studentWeighDTO.studentScoreDetailDTOList);
                        if (unitIndex === -1) {
                            studentWeighDTO.studentScoreDetailDTOList
                                .push(studentScoreUnitDetailDTO);
                        } else {
                            const classIndex = this
                                .findClassDetailDTO(studentScoreUnitDetailDTO.studentClassScoreList[0].classID,
                                    studentWeighDTO.studentScoreDetailDTOList[unitIndex].studentClassScoreList);
                            if (classIndex === -1) {
                                studentWeighDTO.studentScoreDetailDTOList[unitIndex].studentClassScoreList
                                    .push(studentScoreUnitDetailDTO.studentClassScoreList[0])
                            } else {
                                studentWeighDTO.studentScoreDetailDTOList[unitIndex]
                                    .studentClassScoreList[classIndex].studentComponentScoreList
                                    .push(studentScoreUnitDetailDTO.studentClassScoreList[0].studentComponentScoreList[0]);
                            }
                        }
                    }
                    for (const studentWeighDTOAux of this.studentWeighDTOList) {
                        studentWeighDTOAux.studentDomain = 0;
                        studentWeighDTOAux.studentDomainO = 0;
                        for (const unitAux of studentWeighDTOAux.studentScoreDetailDTOList) {
                            unitAux.scorePercentage = 0;
                            unitAux.scorePercentageObtained = 0;
                            for ( const classAux of unitAux.studentClassScoreList) {
                                classAux.scorePercentage = 0;
                                classAux.scorePercentageObtained = 0;
                                for (const compAux of classAux.studentComponentScoreList) {
                                    classAux.scorePercentage = classAux.scorePercentage + compAux.scorePercentage;
                                    classAux.scorePercentageObtained = classAux.scorePercentageObtained + compAux.scorePercentageObtained;
                                }
                                unitAux.scorePercentage =  unitAux.scorePercentage + classAux.scorePercentage;
                                unitAux.scorePercentageObtained =  unitAux.scorePercentageObtained + classAux.scorePercentageObtained;
                            }
                            unitAux.unitDomain = (unitAux.scorePercentageObtained * unitAux.unitWeight) / unitAux.scorePercentage;
                            studentWeighDTOAux.studentDomain = +(studentWeighDTOAux.studentDomain + unitAux.unitWeight)
                                .toFixed(2);
                            studentWeighDTOAux.studentDomainO = +(studentWeighDTOAux.studentDomainO + unitAux.unitDomain)
                                .toFixed(2);
                        }
                    }
                }).catch(reason => console.log('ERROR GETING SCORE VALUES!!!!', reason));
        }
    }

    private initUnitDetailDTO(unitID: string, classID: string, componentID: string, scoreValue: number, scorePercentage: number,
                              scoreObtained: number, classSum: number, unitWeight: number): StudentScoreUnitDetailDTO {
        // const componentScore = Math.round(((scoreObtained * scorePercentage) / scoreValue), -2) ;
        const componentScore = +((scoreObtained * scorePercentage) / scoreValue).toFixed(2);

        const studentScoreComponentDetailDTO: StudentScoreComponentDetailDTO = new StudentScoreComponentDetailDTO();
        studentScoreComponentDetailDTO.componentID = componentID;
        studentScoreComponentDetailDTO.componentType = 'essay';
        studentScoreComponentDetailDTO.scoreValue = scoreValue;
        studentScoreComponentDetailDTO.scoreValueObtained = scoreObtained;
        studentScoreComponentDetailDTO.scorePercentage = scorePercentage;
        studentScoreComponentDetailDTO.scorePercentageObtained = componentScore;

        const studentScoreClassDetailDTO: StudentScoreClassDetailDTO = new StudentScoreClassDetailDTO();
        studentScoreClassDetailDTO.classID = classID;
        studentScoreClassDetailDTO.scorePercentage = classSum;
        studentScoreClassDetailDTO.scorePercentageObtained = componentScore;
        studentScoreClassDetailDTO.studentComponentScoreList = [];

        const studentScoreUnitDetailDTO: StudentScoreUnitDetailDTO = new StudentScoreUnitDetailDTO();
        studentScoreUnitDetailDTO.unitID = unitID;
        studentScoreUnitDetailDTO.unitWeight = unitWeight;
        studentScoreUnitDetailDTO.scorePercentageObtained = (scoreObtained * unitWeight) / classSum;
        studentScoreUnitDetailDTO.studentClassScoreList = [];

        studentScoreClassDetailDTO.studentComponentScoreList.push(studentScoreComponentDetailDTO);
        studentScoreUnitDetailDTO.studentClassScoreList.push(studentScoreClassDetailDTO);

        return studentScoreUnitDetailDTO;
    }

    private findUnitDetailDTO(unitID: string, studentClassScoreList: StudentScoreUnitDetailDTO[]): number {
        let indexUnitCount = 0;
        for (const studentComponentScore of studentClassScoreList) {
            if (studentComponentScore.unitID === unitID) {
                return indexUnitCount;
            }
            indexUnitCount = indexUnitCount + 1;
        }
        return -1;
    }

    private findClassDetailDTO(classID: string, studentClassScoreList: StudentScoreClassDetailDTO[]): number {
        let indexClassCount = 0;
        for (const studentClassScore of studentClassScoreList) {
            if (studentClassScore.classID === classID) {
                return indexClassCount;
            }
            indexClassCount = indexClassCount + 1;
        }
        return -1;
    }

    public getDataDetail(studentID: string, unitID: string, classID: string, componentID: string): string {
        for (const studentWeighDTOAux of this.studentWeighDTOList) {
            if (studentWeighDTOAux.studentID === studentID) {
                for (const studentScoreUnitDetailDTO of studentWeighDTOAux.studentScoreDetailDTOList) {
                    if (studentScoreUnitDetailDTO.unitID === unitID) {
                        for (const studentScoreClassDetailDTO of studentScoreUnitDetailDTO.studentClassScoreList) {
                            if (studentScoreClassDetailDTO.classID === classID) {
                                for (const studentScoreComponentDetailDTO of studentScoreClassDetailDTO.studentComponentScoreList) {
                                    if (studentScoreComponentDetailDTO.componentID === componentID) {
                                        return 'PESO OBTENIDO: ' + studentScoreComponentDetailDTO.scorePercentageObtained + '% | PUNTAJE OBTENIDO: ' + studentScoreComponentDetailDTO.scoreValueObtained;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public weightUnitSum(weightUnitObjectDTOList: WeightUnitObjectDTO[]): number {
        let unitSum = 0;
        for (const weightUnitObjectDTO of weightUnitObjectDTOList) {
            unitSum = unitSum + weightUnitObjectDTO.unitWeight;
        }
        return unitSum;
    }

    getDom(studentDomainO: number, studentDomain: number): string    {
        return ((studentDomainO * 100) / studentDomain).toFixed(2);
    }
}
