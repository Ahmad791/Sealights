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
    public getId(){
        return this.EmployeeId;//usually for employees the Empoyee ID is more important, using it can get entire object
    }
}