
export interface Assessment {
    assessmentData:AssessmentData;
    questionMasterList:QuestionMasterList;
}

export interface AssessmentData{
    id: string;
    name: string;
    starDate: string;
    endDate: string;
    assignedClassId: number;
    description: string;
    scored:number,
    assessmentId

    
}

export interface QuestionMasterList{
    id:number;
    assessmentId:number;
    numberOfQuestion:number;
    totalScore:number;
    passingScore:number;
    totalScoreObtained:number;
    
    questionsList:[QuestionsList]
}
export interface StudentAnswerMasterList{
    id:number;
    assessmentId:number;
    numberOfQuestion:number;
    totalScore:number;
    passingScore:number;
    totalScoreObtained:number;
    questionsList:[QuestionsList]
}

export interface QuestionsList{
    id:number;
    question:string,
    description: string,
    correctAnswer: string,
    studentAnswer: string,
    point: number,
    scoredPoint: number,
    type: number,
    options:[{
        correctAnswer:string;
        text:string,
        isCorrect:boolean
      }],

}

