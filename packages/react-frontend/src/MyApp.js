import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from './Form';

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter (index) {
        const userToDelete = characters[index];
        fetch(`http://localhost:8000/users/${userToDelete.id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.status === 204) {  // Successfully deleted
                const updated = characters.filter((character, i) => {
                    return i !== index;
                });
                setCharacters(updated);
                console.log('Successfully deleted the user.');
            } else {
                console.error('Failed to delete user.');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function updateList(person) { 
        postUser(person)
            .then(res => {
                if (res.status !== 201) {
                    throw new Error('Insertion failed on the backend');
                }
                // Check if content type is JSON before attempting to parse
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                }
                throw new Error('Received non-JSON response from the server');
            })
            .then(data => {
                if (data && data.id) {
                    setCharacters(prevCharacters => [...prevCharacters, data]);
                    console.log('User added successfully with ID:', data.id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }    
    

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
    
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
      }, [] );
    
    return (
        <div className="container">
          <Table characterData={characters} 
              removeCharacter={removeOneCharacter} />
          <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp; 