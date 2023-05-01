import {Person} from "./ClassPerson";// in case of future reorgenization adding import is better
export class Employee extends Person{
    private id: number;
    private salary: number;

    public constructor(name:string,age:number,id:number,salary:number){
        super(name,age);
        this.id=id;
        this.salary=salary;
    }
//------------------------------------------------------------   methods
    public work(){
        console.log("Employee with id "+ this.id+ " is working" );
        // note: wanted to add name but didn't want to add unrequested methods
    }
    public getSalary(){
        return this.salary;
    }
}