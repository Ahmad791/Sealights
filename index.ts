import { json } from "body-parser";
import express, { Application, Request, Response } from "express";
import { Employee } from "./ClassEmployee";
import { Person } from "./ClassPerson";
const Joi=require("joi")// sill be useful in bonus tasks
const app: Application = express();
const port = process.env.PORT || 5031;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initializing arrays with preloaded data for testing
var Employees=[new Employee("Employee1",21,1,12000),new Employee("Employee2",23,2,13000)]
var People=[new Person("person1",21),new Person("Person2",23)]


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

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured`);
}
