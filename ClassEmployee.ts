import {Person} from "./ClassPerson";// in case of future reorgenization adding import is better
export class Employee extends Person{
    private EmployeeId: number;
    private salary: number;

    public constructor(name:string,age:number,id:number,salary:number,EmployeeId:number){
        super(id,name,age);
        this.EmployeeId=EmployeeId;
        this.salary=salary;
    }
//------------------------------------------------------------   methods
    public work(){
        console.log("Employee with id "+ this.EmployeeId+ " is working" );
    }
    public getSalary(){
        return this.salary;
    }
    //note overrding the getId might break the addEmployee since it checks if employee with "id" exists, recomended to add different function
}