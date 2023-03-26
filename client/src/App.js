import { useState, useEffect } from "react";


function App() {
  const [todos, setTodos] = useState([]);
  const [popupactive, setpopupactive] = useState(false);
  const [newtodo, setnewtodo] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))

    console.log(todos)
  }, []);

  const completeTodo = async (id) => {
    const data = await fetch("http://localhost:4000/todo/complete/" + id)
      .then((res) => res.json())

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }
      return todo;
    }))
  }
  
  const deleteTodo = async (id) => {
    const data = await fetch("http://localhost:4000/todo/delete/" + id, {
      method: "DELETE"
    }).then((res) => res.json())
    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  // const deleteTodo = async id => {
	// 	const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

	// 	setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
	// }

  const addtodo = async () => {
    if (newtodo == "") {
      alert("Please enter a task")
      return;
    }

    const data = await fetch("http://localhost:4000/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newtodo,
        complete: false
      })
    }).then((res) => res.json())
    setTodos([...todos, data])
    setnewtodo("")
    setpopupactive(false)

  }
  return (
    <>
      <div className="app">
        <h1>Welcome, Suryansh</h1>
        <h4>Your tasks</h4>
        <div className="todos">
          {
            todos.map((todo) => (

              <div className=
                {"todo " + (todo.complete ? "iscomplete" : "")}
                key={todo._id} onClick={() => completeTodo(todo._id)}>
                <div className="checkbox"></div>
                <div className="text">{todo.text}</div>
                <div className="delete" onClick={() => deleteTodo(todo._id)}>X</div>
              </div>
            ))}

        </div>
        <div className="addtodo" onClick={() => setpopupactive(true)}>+</div>
        {
          popupactive ? (
            <div className="popup">
              <div className="closepopup" onClick={() => setpopupactive(false)}>X</div>
              <div className="content">
                <h3>Add task</h3>
                <input
                  type="text"
                  className="addinput"
                  placeholder="Enter your task"
                  value={newtodo}
                  onChange={e => setnewtodo(e.target.value)} />
                <button className="button" onClick={addtodo}>Create task</button>
              </div>
            </div>
          )

            : ''}
      </div>
    </>
  );
}

export default App;