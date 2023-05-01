export class Person {
    private name: string;
    private age: number;
  
    public constructor(name: string,age: number){
        this.name=name;
        this.age=age;
    }

//------------------------------------------------------------   methods
    public greet(){
        console.log("Hi, my name is " + this.name);
    }
    
    public getAge(): number{
        return this.age;
    }
}
