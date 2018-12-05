import axios from "axios";
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ListItem from "./ListItem";
import loadingGif from "./loadinggif.gif";

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: "",
      editKey: false,
      notification: null,
      editingIndex: null,
      loading: true,
      todos: []
    };

    this.apiURL = "https://5c051cdf6b84ee00137d2501.mockapi.io";
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(this.apiURL + "/todos");
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      });
    }, 1000);
  }

  componentWillMount() {
    console.log("will mount");
  }

  alert(notification) {
    this.setState({
      notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];
    const response = await axios.put(this.apiURL + "/todos/" + todo.id, {
      name: this.state.newTodo
    });
    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({
      todos,
      editKey: false,
      editingIndex: null,
      newTodo: ""
    });
    this.alert("Todo updated successfully!");
  }

  editTodo(index) {
    const todos = this.state.todos[index];
    this.setState({
      editKey: true,
      newTodo: todos.name,
      editingIndex: index
    });
  }

  async deleteTodo(index) {
    const todos = this.state.todos;
    const todo = todos[index];
    await axios.delete(this.apiURL + "/todos/" + todo.id);

    delete todos[index];
    this.setState({
      todos
    });

    this.alert("Todo deleted successfully!");
  }

  async addTodo() {
    const response = await axios.post(this.apiURL + "/todos", {
      name: this.state.newTodo
    });

    const oldTodos = this.state.todos;
    oldTodos.push(response.data);
    this.setState({
      todos: oldTodos,
      newTodo: ""
    });
    this.alert("Todo added successfully!");
  }

  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            CRUD React
          </a>
        </header>
        <div className="container">
          {this.state.notification && (
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          )}
          <input
            type="text"
            className="my-4 form-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo}
          />
          <button
            className="btn-success mb-3 form-control"
            onClick={this.state.editKey ? this.updateTodo : this.addTodo}
            disabled={this.state.newTodo.length < 1}
          >
            {this.state.editKey ? "Update Todo" : "Add Todo"}
          </button>
          {this.state.loading && <img src={loadingGif} alt="" />}
          {(!this.state.editKey || this.state.loading) && (
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    editTodo={() => {
                      this.editTodo(index);
                    }}
                    deleteTodo={() => {
                      this.deleteTodo(index);
                    }}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default App;
