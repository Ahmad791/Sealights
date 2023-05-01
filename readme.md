This is the homework I was assigned to.

To install the Prerequisite you can run: 
    bash pre.sh

1+2. Made the the Person and Employee classes in ClassPerson.ts ClassEmployee.ts respectively
In order to test parts 1 and 2 you can run
    ts-node tests.ts
I've used the npm package "ts-node" which is very useful for running ts code and testing it

3. Installed express and made 3 seperate get requests "/","/People","/Employees" for the tasks checking if server is live , get all people, get all employees respectively.

I've already modefied the script in package.json, to start the server run:
    npm run start

The default port is 5031 (chose it randomly so it will probably won't be in use), however you can change it by changing the environment "PORT" variable.
