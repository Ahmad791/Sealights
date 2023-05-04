import express, { Application, Request, Response } from "express";
//import * as session from "express-session";
import Joi from "joi";
import * as redis from 'redis';
import { Employee } from "./classes/ClassEmployee";
import { Logger } from "./classes/ClassLogger";
import { Person } from "./classes/ClassPerson";
const app: Application = express();
const port = process.env.PORT || 5031;

const { REDIS_URL = "redis://redis" } = process.env;
const options = {
    legacyMode: false,
    url: REDIS_URL,
}

const client = redis.createClient(options);
client.connect();
client.on('error', err => { 
    console.error('redis error: ' + err);
});

// Every API sends the parameters to other functions as sting and it gets changed there to
// JSON when needed. They People and Employees APIs send data to the same function so no need 
// to change multiple times. For example "checkGetValidity" is responsible for checking data 
// validity and is almost used in all APIs. Read functions' notes for more info.
//Joi schemas for checking inputs
const getPersonSchema=Joi.object({id:Joi.number().integer().required()});
const addPersonSchema=Joi.object({id:Joi.number().integer().required(),name:Joi.string().alphanum().required(),age:Joi.number().integer().required()});
const addEmployeeSchema=Joi.object({id:Joi.number().integer().required(),name:Joi.string().alphanum().required(),age:Joi.number().integer().required(),
salary:Joi.number().integer().required()});
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initializing arrays with preloaded data for testing
client.hSet("Employees","1",JSON.stringify(new Employee("Employee1",21,3,12000,1)));
client.hSet("Employees","2",JSON.stringify(new Employee("Employee2",23,5,13000,2)));
client.hSet("People","23",JSON.stringify(new Person(23,"person1",21)));
client.hSet("People","15",JSON.stringify(new Person(15,"Person2",23)));


var Ecount=2;//employee count for when adding a new one
const bufferSize=25;//should warn if map size exceeds this number
const start=Date.now()

app.get("/", // checking if the server is live
    async (req: Request, res: Response): Promise<Response> => {
        Logger.info("Pulse checked, live for "+(Date.now()-start)/1000+" seconds and server working fine")
        return res.status(200).send({
            message: "Server working fine!!"+", The redis server is "+ (client.isReady?"connected":"not connected"),
        });
    }
);

app.get("/Employees", //get all Employees
    async (req: Request, res: Response): Promise<Response> => {
        let x=await client.hGetAll("Employees");
        return res.status(200).send(Object.values(x).map(x=>JSON.parse(x)));
    }
);

app.get("/People", //get all People
    async (req: Request, res: Response): Promise<Response> => {
        let x=await client.hGetAll("People");
        return res.status(200).send(Object.values(x).map(x=>JSON.parse(x)));
    }
);
//---------------------------------------------------------------------Bonus methods
async function checkGetValidity(data:string,query:string,schema:Joi.ObjectSchema){//Function for checking data validity according to Joi schemas 
//to use, send data as JSON stringified, array to search for duplicity and the Joi schema
    const valid=schema.validate(JSON.parse(data));//check if input valid according to schema sent
        if(valid.error){//check if input is valid 
            return {code:400,message:valid.error.message};
        }
        const r=await client.hGet(query,JSON.stringify(valid.value.id));
        if(r!=null) return {code:200,message:JSON.parse(JSON.stringify(r))};// check if object exists in provided array and return it if it does
        return {code:404,message:"Not found"};
}

async function deleteById(data:string,query:string){
    const x=await checkGetValidity(data,query,getPersonSchema);
    if(x.code!=200){ //doesn't exist or bad input
        return x;
    }else
    { 
        console.log(JSON.stringify(JSON.parse(data).id),"9",typeof(JSON.stringify(JSON.parse(data).id)),JSON.stringify(JSON.parse(data).id)==="9")
        const r=await client.hDel(query,JSON.parse(data).id);
    return x;
}
}

async function addById(data:string,query:string,schema:Joi.ObjectSchema){
    const x=await checkGetValidity(data,query,schema);
    if(x.code==400) return x;
    if(x.code==200)return {code:x.code,message:"already exists"}
    else return{code:x.code,message:"added"}//doesn't exist, return to parent function to add object
}


//------------------------------------  People APIs
app.get("/People/:id", //Get specific person
    async (req: Request, res: Response): Promise<Response> => {
        const x=await checkGetValidity(JSON.stringify(req.params),"People",getPersonSchema);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/People/:id", //Delete specific Person
    async (req: Request, res: Response): Promise<Response> => {
       const x=await deleteById(JSON.stringify(req.params),"People");
       if(x.code==200) return res.status(200).send("Person deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/People/add", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=await addById(JSON.stringify(req.body),"People",addPersonSchema);
        if(x.code==404){
            client.hSet("People",JSON.stringify(req.body.id),JSON.stringify(new Person(req.body.name,req.body.age,req.body.id)))
            x.code=200;
            if(await client.dbSize()>=bufferSize) Logger.warn("Size is "+client.dbSize());
        }
        return res.status(x.code).send(x.message);
    }
);
//------------------------------------  Employees' APIs
app.get("/Employees/:id", //get specific Employee
        async (req: Request, res: Response): Promise<Response> => {
        const x=await checkGetValidity(JSON.stringify(req.params),"Employees",getPersonSchema);
        return res.status(x.code).send(x.message)
    }
);

app.delete("/Employees/:id", //Delete specific employee
    async (req: Request, res: Response): Promise<Response> => {
       const x=await deleteById(JSON.stringify(req.params),"Employees");
       if(x.code===200) return res.status(200).send("Employee deleted");
       else return res.status(x.code).send(x.message);
    }
);

app.post("/Employees/add", //add specific employee
    async (req: Request, res: Response): Promise<Response> => {
        const x=await addById(JSON.stringify(req.body),"Employees",addEmployeeSchema);
        if(x.code==404){
            client.hSet("Employees",JSON.stringify(req.body.id),JSON.stringify(new Employee(req.body.name,req.body.age,req.body.id,req.body.salary,Ecount++)));
            x.code=200;
            if(await client.dbSize()>=bufferSize) Logger.warn("Size is "+client.dbSize());
        }
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
