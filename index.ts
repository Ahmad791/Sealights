import { json } from "body-parser";
import express, { Application, Request, Response } from "express";
import Joi from "joi";
import { Employee } from "./ClassEmployee";
import { Person } from "./ClassPerson";
const app: Application = express();
const port = process.env.PORT || 5031;

// Every API sends the parameters to other function as sting and it gets changed there to
// JSON when needed, 

//Joi schemas for checking inputs
const getPersonSchema=Joi.object({id:Joi.number().integer().required()});
const addPersonSchema=Joi.object({id:Joi.number().integer().required(),name:Joi.string().alphanum().required(),age:Joi.number().integer().required()});
const addEmployeeSchema=Joi.object({id:Joi.number().integer().required(),name:Joi.string().alphanum().required(),age:Joi.number().integer().required(),
salary:Joi.number().integer().required()});
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initializing arrays with preloaded data for testing
var Employees=new Map<number,Employee>([[1,new Employee("Employee1",21,3,12000,1)],[2,new Employee("Employee2",23,5,13000,2)]]);
var People=new Map([[23,new Person(23,"person1",21)],[15,new Person(15,"Person2",23)]]);
var Ecount=Employees.size+1;//employee count for when adding a new one


app.get("/", // checking if the server is live
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Server working fine",
        });
    }
);

app.get("/Employees", //get all Employees
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send([...Employees.values()]);
    }
);

app.get("/People", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send([...People.values()]);
    }
);
//---------------------------------------------------------------------Bonus methods
function checkGetValidity(data:string,arr:Map<number,Person>,schema:Joi.ObjectSchema){//check if the get requests validity, 
//to use send data as JSON stringified, array to search for duplicity and the Joi schema
    const valid=schema.validate(JSON.parse(data));//check if input valid according to schema sent
        if(valid.error){//check if input is valid 
            return {code:400,message:valid.error.message};
        }
        const r=arr.get(parseInt(valid.value.id));
        if(r) return {code:200,message:JSON.parse(JSON.stringify(r))};// check if Employee exists and return it if it does
        return {code:404,message:"Not found"};
}

function deleteById(data:string,arr:Map<number,Person>){
    const x=checkGetValidity(data,arr,getPersonSchema);
    if(x.code!=200){ //doesn't exist or bad input
        return x;
    }else
    { arr.delete(parseInt(JSON.parse(data).id));
    return x;
}
}

function addById(data:string,arr:Map<number,Person>,schema:Joi.ObjectSchema){
    const x=checkGetValidity(data,arr,schema);
    if(x.code==400) return x;
    const d=JSON.parse(data);
    if(x.code==200)return {code:x.code,message:"already exists"}
    else return{code:x.code,message:"added"}
}


//------------------------------------  People APIs
app.get("/People/:id", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        const x=checkGetValidity(JSON.stringify(req.params),People,getPersonSchema);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/People/:id", //Delete specific Person
    async (req: Request, res: Response): Promise<Response> => {
       const x=deleteById(JSON.stringify(req.params),People);
       if(x.code==200) return res.status(200).send("Person deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/People/add", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=addById(JSON.stringify(req.body),People,addPersonSchema);
        if(x.code==404)People.set(parseInt(req.body.id),new Person(req.body.id,req.body.name,req.body.age));
        return res.status(200).send(x.message);
    }
);
//------------------------------------  Employees' APIs
app.get("/Employees/:id", //get specific Employee
        async (req: Request, res: Response): Promise<Response> => {
        const x=checkGetValidity(JSON.stringify(req.params),Employees,getPersonSchema);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/Employees/:id", //Delete specific employee
    async (req: Request, res: Response): Promise<Response> => {
       const x=deleteById(JSON.stringify(req.params),Employees);
       if(x.code===200) return res.status(200).send("Employee deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/Employees/add", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=addById(JSON.stringify(req.body),Employees,addEmployeeSchema);
        if(x.code==404)Employees.set(parseInt(req.body.id),new Employee(req.body.name,req.body.age,req.body.id,req.body.salary,Ecount++));
        return res.status(200).send(x.message);
    }
);


try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured`);
}
