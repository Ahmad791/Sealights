import { json } from "body-parser";
import express, { Application, Request, Response } from "express";
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
var Employees=[new Employee("Employee1",21,3,12000,1),new Employee("Employee2",23,5,13000,2)]
var People=[new Person(23,"person1",21),new Person(15,"Person2",23)]


app.get("/", // checking if the server is live
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Server working fine",
        });
    }
);

app.get("/Employees", //get all Employees
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send(JSON.parse(JSON.stringify(Employees)));
    }
);

app.get("/People", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send(JSON.parse(JSON.stringify(People)));
    }
);
//---------------------------------------------------------------------Bonus methods
function checkGetValidity(req:Request,res:Response,arr:Array<Person>){//check if the get requests validity
    const valid=getEmployee.validate(req.params);
        if(valid.error){//check if input is valid 
            return res.status(400).send(valid.error.message)
        }
        const r=arr.find(a=>a.getId()===parseInt(valid.value.id));
        if(r) return res.status(200).send(JSON.parse(JSON.stringify(r)));// check if Employee exists
        return res.status(404).send("Employee not found");
}

app.get("/People/:name", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send(JSON.parse(JSON.stringify(People)));
    }
);

app.get("/Employees/:id", //Specific employee
        async (req: Request, res: Response): Promise<Response> => {
        return checkGetValidity(req,res,Employees);
    }
);

app.delete("/Employees/:id", //Specific employee
        async (req: Request, res: Response): Promise<Response> => {
        if(res.statusCode!=200) return checkGetValidity(req,res,Employees);
        //delete Employees[Employees.indexOf(a=>a.getId()===parseInt(req.params.id))]
        return res.status(200).send("deleted");
    }
);




try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured`);
}
