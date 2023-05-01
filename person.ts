class Person {
    private name: string;
    private age: BigInt;
  
    public constructor(name: string,age: BigInt){
        this.name=name;
        this.age=age;
    }

    public greet(){
        console.log("Hi, my name is " + this.name);
    }
    
    public getAge(): BigInt{
        return this.age;
    }
}
