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
    const todos = await Todo.find().sort({ timestamp: -1 })
    res.status(200).json(todos)
})

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
        // complete: req.body.complete
    });
    todo.save();
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).send(error)
    }

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


app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})

//patch command to update json using id
// app.patch('/todo/update/:id', async (req, res) => {
//     const todo = await Todo.findByIdAndUpdate(req.params.id, "req.body",
//         { new: true },
//         (err, todo) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(todo);
//             }
//         });
//     // todo.complete = req.body.complete;
//     // todo.text = req.body.text;
//     todo.save();
//     res.json(todo);
// })     

app.patch('/todo/update/:id', async (req, res) => {
    try {
        const reqid = req.params.id;
        const data = await Todo.findByIdAndUpdate({ _id: reqid }, req.body, { new: true })
        // data.text = req.body.text
        // data.save()
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error)
    }
})     