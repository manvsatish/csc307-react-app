import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      

const users = { 
    users_list : [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

// app.get('/users', (req, res) => {
//     res.send(users);
// });

const findUserByName = (name) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name); 
}

// app.get('/users', (req, res) => {
//     const name = req.query.name;
//     if (name != undefined){
//         let result = findUserByName(name);
//         result = {users_list: result};
//         res.send(result);
//     }
//     else{
//         res.send(users);
//     }
// });

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

const addUser = (user) => {
    user.id = generateId();  // Assign a new ID
    users['users_list'].push(user);
    return user;  // Return the updated user
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const newUser = addUser(userToAdd);  // Get the updated user with ID
    res.status(201).send(newUser);  // Send the new user as response
});

const findUsersByNameAndJob = (name, job) => {
    if (name && job) {
        return users['users_list']
            .filter( (user) => user['name'] === name && user['job'] === job);
    } else {
        return null;  // Indicates that the proper parameters were not provided.
    }
}

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    // If both name and job are provided, find by both.
    if (name && job) {
        let result = findUsersByNameAndJob(name, job);
        if (result && result.length > 0) {
            res.send({users_list: result});
        } else {
            res.status(404).send('No users found with the provided name and job.');
        }
    }
    // If only name is provided, find by name.
    else if (name) {
        let result = findUserByName(name);
        if (result && result.length > 0) {
            res.send({users_list: result});
        } else {
            res.status(404).send('No users found with the provided name.');
        }
    }
    // If neither name nor job is provided, return all users.
    else {
        res.send(users);
    }
});

const deleteUserById = (id) => {
    const index = users['users_list'].findIndex(user => user['id'] === id);
    if (index !== -1) {
        users['users_list'].splice(index, 1);
        return true;  // Indicates the user was found and deleted.
    }
    return false;  // Indicates the user was not found.
}

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const wasDeleted = deleteUserById(id);

    if (wasDeleted) {
        res.status(204).send();  // No content
    } else {
        res.status(404).send({ message: 'User not found.' });
    }
});

const generateId = () => {
    return Math.random().toString(36).substring(2, 8);
};
