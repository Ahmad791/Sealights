This is the homework I was assigned to.

note: Try not to change anything before reading the comments in the file, a lot of things depend on other things. The code is easily expandable but some minor changes can cause some functions not to work properly, reading all comments and understanding the structure before changing is advised.

First you should run the following command to install all dependencies in package.json

    npm install

1+2. Made the the Person and Employee classes in ClassPerson.ts ClassEmployee.ts respectively
In order to test parts 1 and 2 you can run (note: Employee inherets from Person)
    
    ts-node tests.ts
    
I've used the npm package "ts-node" which is very useful for running ts code and testing it
you can install it easily using (already in dependencies no need to reinstall)

    npm install ts-node-dev --save-dev

3. Installed express and made 3 seperate get APIs requests "/","/People","/Employees" for the tasks checking if server is live , get all people, get all employees respectively. (returns a list of json objects).

I've already modefied the script in package.json, to start the server run:
    
    npm run start

The default port is 5031 (chose it randomly so it will probably won't be in use), however you can change it by changing the environment "PORT" variable.

For checking pulse you can run "localhost:5031/" in your postman.

"localhost:5031/People", localhost:5031/Employees" are for getting all People and Employees respectively. (I've added some data for ease of testing).


Bonus:

Getting and deleting People/Employees is done using "localhost:5031/People/:id", localhost:5031/Employees/:id" get and delete APIs (replace the ":id" with the id of the person/employee).

Adding person/employee is done through "localhost:5031/People/add"/"localhost:5031/Employees/add" POST APIs, the data is passed in the body. 
Add a person requires (id:number,name:string,age:number), the employee requires (salary:number) on top of that, no need for employee id, it's automatically added using a counter.

Testing:

For the first 2 parts you can run the tests.ts that I've prepared with few actions by running:

    ts-node Tests/tests.ts

For the APIs and bonus I've already prepared few tests on "Postman" in "Tests/sealights excersise.postman_collection.json", you can import the collection to your postman and run it.

Guide for importing data: https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman

Guide for running the tests: https://learning.postman.com/docs/collections/running-collections/intro-to-collection-runs/