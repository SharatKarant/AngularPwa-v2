export interface User {
    userData: UserData
}

export interface UserData {
    id: number;
    userId: number;
    roleId: number;
    schoolId: number;
    classId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    password: string;
    role: string;
    userName: string;
    mobileNo: string;
    state: string;
    address: string;
    branchId: number;
    email: string;
    dateOfBirth: string;
    isActive: boolean;
    isSave: boolean;
    postalNo: string;

}