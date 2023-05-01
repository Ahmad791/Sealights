export class Person {
    private name: string;
    private age: number;
    private id: number;
  
    public constructor(id:number, name: string,age: number){
        this.name=name;
        this.age=age;
        this.id=id;
    }

//------------------------------------------------------------   methods
    public greet(){
        console.log("Hi, my name is " + this.name);
    }
    
    public getAge(): number{
        return this.age;
    }
    public getId(): number{
        return this.id;
    }
}
