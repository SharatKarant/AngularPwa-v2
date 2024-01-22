export interface School {
    schoolData:SchoolData;
}

export interface SchoolData{
    id:number;
    name:string;
    logo:string;
    schoolCode:string;
}
export interface BranchData{
    id:number;
    name:string;
    schoolName:string;
    schoolId:number;
    address:string;
    city:string;
    state:string;
    postalCode:string;
    contactNo:string;
    email:string;
    branchCode:string;
}

export interface ClassData{
    id:number;
    branchId:number;
    branchName:string;
    schoolId:number;
    schoolName:string;
    name:string;
}
