import { Employee } from "../classes/ClassEmployee";
import { Logger } from "../classes/ClassLogger";
const l=Logger
let n=new Employee("the Dude",19,123,22000,1);
n.greet();
l.log(n.getAge());
n.work();
l.log(n.getSalary());