import { json } from "body-parser";
import express, { Application, Request, Response } from "express";
import { x } from "joi";
import { Employee } from "./ClassEmployee";
import { Person } from "./ClassPerson";
const Joi=require("joi")// sill be useful in bonus tasks
const app: Application = express();
const port = process.env.PORT || 5031;

//Joi schemas for checking inputs
const getPerson=Joi.object({name:Joi.string().alphanum().required(),age:Joi.number().integer()});
const getEmployee=Joi.object({id:Joi.number().integer()});

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initializing arrays with preloaded data for testing
var Employees=new Map([[1,new Employee("Employee1",21,3,12000,1)],[2,new Employee("Employee2",23,5,13000,2)]]);
var People=new Map([[23,new Person(23,"person1",21)],[23,new Person(15,"Person2",23)]]);
var Ecount=3;//employee count for when adding a new one


app.get("/", // checking if the server is live
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Server working fine",
        });
    }
);

app.get("/Employees", //get all Employees
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send([Employees.values()]);
    }
);

app.get("/People", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send(JSON.parse(JSON.stringify(People.entries())));
    }
);
//---------------------------------------------------------------------Bonus methods
function checkGetValidity(req:Request,arr:Map<number,Person>){//check if the get requests validity
    const valid=getEmployee.validate(req.params);
        if(valid.error){//check if input is valid 
            return {code:400,message:valid.error.message};
        }
        const r=arr.get(parseInt(valid.value.id));
        if(r) return {code:200,message:JSON.parse(JSON.stringify(r))};// check if Employee exists
        return {code:404,message:"Not found"};
}

function deleteById(req:Request,arr:Map<number,Person>){
    const x=checkGetValidity(req,arr);
    if(x.code!=200){ 
        return x;
    }else
    { arr.delete(parseInt(req.params.id));
    return x;
}
}

function addById(req:Request,arr:Map<number,Person>){
    const x=checkGetValidity(req,Employees);
    if(x.code==200)return {code:x.code,message:"already exists"}
    else {Employees.set(parseInt(req.params.id),new Employee("Employee5",21,12,15000,1))
    return{code:x.code,message:"added"}
    }
}


//------------------------------------  People APIs
app.get("/People/:id", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        const x=checkGetValidity(req,People);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/People/:id", //Delete specific Person
    async (req: Request, res: Response): Promise<Response> => {
       const x=deleteById(req,People);
       if(x.code==200) return res.status(200).send("Person deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/People/:id", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=addById(req,People);
        return res.status(x.code).send(x.message);
    }
);
//------------------------------------  Employees' APIs
app.get("/Employees/:id", //get specific Employee
        async (req: Request, res: Response): Promise<Response> => {
        const x=checkGetValidity(req,Employees);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/Employees/:id", //Delete specific employee
    async (req: Request, res: Response): Promise<Response> => {
       const x=deleteById(req,Employees);
       if(x.code==200) return res.status(200).send("Employee deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/Employees/:id", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=addById(req,Employees);
        return res.status(x.code).send(x.message);
    }
);





try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured`);
}
