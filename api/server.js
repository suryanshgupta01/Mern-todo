const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 4000;
const Todo = require('./models/todo');

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/mern-todo-yt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("connencted to db"))
    .catch(console.error)

app.listen(port, () => console.log(`server started at ${port}`))

app.get('/todos', async (req, res) => {
    const todos = await Todo.find()
    res.json(todos)
})

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        complete: req.body.complete
    });
    todo.save()
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
})

//chatgpt recommended below
// app.delete('/todo/delete/:id', async (req, res) => {
//     try {
//       const todo = await Todo.findByIdAndDelete(req.params.id);
//       if (!todo) {
//         return res.status(404).send('Todo not found');
//       }
//       res.json(todo);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server error');
//     }
//   });


app.get('/todo/complete/:id',async(req,res)=>{
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})

