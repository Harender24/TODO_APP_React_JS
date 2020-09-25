import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import './App.css';
import db from './firebase';
import Todo from './Todo';
import firebase from 'firebase';
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // When the App Loads, we need to listen to the db and fetch new todos as the get added/removed
  // useEffect() is a function that handles your actions when something affects your component.
  // Here in useEffect you can pass an array as the second argument. This array clearly tells react that just call useEffect when fields in me has been changed.
  // To tell useEffect to act like componentDidMount just pass an empty array and everything will be perfect.
  useEffect(() => {
    db.collection('todos')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo }))
        );
      });
  }, []);
  const addTodo = (event) => {
    event.preventDefault();
    db.collection('todos').add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput('');
  };
  return (
    <div className='App'>
      <h1>Hello World</h1>

      <form>
        <FormControl>
          <InputLabel htmlFor='my-input'>Write a TODO</InputLabel>
          <Input
            id='my-input'
            aria-describedby='my-helper-text'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <FormHelperText id='my-helper-text'>
            Enter all your TODOs
          </FormHelperText>
        </FormControl>
        <Button
          disabled={!input}
          type='submit'
          onClick={addTodo}
          variant='contained'
          color='primary'>
          Add Todo
        </Button>
      </form>

      <ul>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
