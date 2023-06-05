import { useState, useEffect } from "react";


function App() {
  const [todos, setTodos] = useState([]);
  const [popupactive, setpopupactive] = useState(false);
  const [newtodo, setnewtodo] = useState("");
  const [updatedtodo, setupdatedtodo] = useState("");
  const [popupdate, setpopupdate] = useState(false);
  const [idtoupdate, setidtoupdate] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setTodos(data)
      })

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

  //make a put request to edit todo
  const updatetodo = async () => {
    // console.log(updatedtodo)
    const id = idtoupdate
    completeTodo(id) //have to toggle coz it was acting as we clicked the todo
    // console.log(id)
    setTodos(todos.map((elem) => {
      if (elem._id === id) {
        elem.text = `${updatedtodo}`
      }
      return elem
    }))

    // todos.save()
    fetch("http://localhost:4000/todo/update/" + id, {
      method: 'PATCH',
      body: JSON.stringify({
        text: `${updatedtodo}`
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
    // .then((json) => console.log(json));

    setupdatedtodo("")
    setpopupdate(false)
    // console.log(data)
    // console.log(updatedtodo)
    // const data = await fetch("http://localhost:4000/todo/update/" + id, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     text: updatedtodo
    //   })
    // }).then((res) => res.json())

    // setTodos([...todos, data])


    // .then((data) => console.log(data))
    // const deleteTodo = async id => {
    // 	const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

    // 	setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
    // }

    // const updatetodo = async (id) => {
    //   const data = await fetch("http://localhost:4000/todo/update/" + id, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       text: updatedtodo 
    //     })
    //   }).then((res) => res.json())
    //   setTodos([...todos, data])
    //   setupdatedtodo("")
    //   setpopupdate(false)
    //   console.log(data)
    //   console.log(updatedtodo)
    //   // console.log(res)
    //   // console.log(body)
    //   // setTodos(todos => todos.map(todo => {
    //   //   if (todo._id === data._id) {
    //   //     todo.complete = data.complete;
    //   //   }
    //   //   return todo;
    //   // }))


    // }

  }

  const addtodo = async () => {
    if (newtodo === "") {
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
        complete: true
      })
    }).then((res) => res.json())
    setTodos([data, ...todos]) //changed order to match latest todo at top
    setnewtodo("")
    setpopupactive(false)

  }
  const updatefunction = (id) => {
    setpopupdate(true);
    setidtoupdate(id)
    // setTimeout(() => {
    //     updatetodo(id);
    // }, 3000);
  };
  return (
    <>
      <div className="app">
        <h1>Welcome, Suryansh</h1>
        <h4>Your tasks</h4>
        <div className="todos">
          {
            todos.map((todo) => (
              <>
                <div className=
                  {"todo " + (todo.complete ? "iscomplete" : "")}
                  key={todo._id} onClick={() => completeTodo(todo._id)}>
                  <div className="checkbox"></div>
                  <div className="text">{todo.text}</div>
                  <div className="edittodo" onClick={() => updatefunction(todo._id)}>EDIT</div>
                  <div className="delete" onClick={() => deleteTodo(todo._id)}>X</div>
                </div>
              </>

            )
            )}

        </div>

        {/* <div className="edittodo" onClick={() => setpopupdate(true)}>EDIT</div> */}
        {
          popupdate ? (
            <div className="popup">
              <div className="closepopup" onClick={() => setpopupdate(false)}>X</div>
              <div className="content">
                {/* hgszdghsfjjgsd-{updatedtodo} */}
                <h3>edit task</h3>
                <input
                  type="text"
                  className="addinput"
                  placeholder="Enter your task"
                  value={updatedtodo}
                  onChange={e => setupdatedtodo(e.target.value)} />
                <button className="button" onClick={() => updatetodo()}>EDIT task</button>
              </div>
            </div>
          )
            : ''}
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