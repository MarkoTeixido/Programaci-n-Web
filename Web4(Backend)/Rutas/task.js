const express = require('express');
const router = express.Router();
const tarea = require('../Modelos/Task');

/* //Obtener todas las tareas
router.get('/', (req, res) => {
    //res.status(200).json({res:"Hello world"})
    //res.json({res:"Hello world"})
    const tareas = Tarea.find()
    res.json(tareas);
}) */

router.get('/', async (req,res) => {
    try{
        const tasks = await tarea.find();
        res.status(200).json(tasks);
    }catch(err){
        res.status(403).json({message: err});
    }
})


//Obtener tarea por Id 
router.get('/:taskId', async (req, res) => {
    try{
        const task = await tarea.findById(req.params.taskId);
        res.status(200).json(task);
    }catch(err){
        res.status(403).json({message: err});
    }
})

//Crear nueva tarea
router.post('/', async (req, res) => {
    const task = new tarea({
        taskName: req.body.taskName,
        done: req.body.done,
        geo: req.body.geo
    });

    try{
        const savedTask = await task.save();
        res.status(200).json(savedTask);
    }catch(err){
        res.status(403).json({message: err});
    }
})

//Borrar una tarea por Id
router.delete('/:taskId', async (req, res) => {
    try{
        const removeTask = await tarea.deleteOne({_id: req.params.taskId});
        res.status(200).json(removeTask);
    }catch(err){
        res.status(403).json({message: err});
    }
});

//Actualizar tarea
router.patch('/:taskId', async (req, res) => {
    try{
        const UpdateTask = await tarea.updateOne(
            {_id: req.params.taskId},
            { $set: {done: req.body.done}}
        );
        res.status(200).json(UpdateTask);
    }catch(err){
        res.status(403).json({message: err});
    }
});

module.exports = router