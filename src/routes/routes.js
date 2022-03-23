const express = require('express');
const router = express.Router();
const knex = require('../database/knex/knex');

router.get('/tasks', async (request, response) => {
    const tasks = await knex.select().from('tasks')

    response.json(tasks)
})

router.post('/task', async (request, response) => {
    const { description } = request.body;

    await knex('tasks').insert({ description: description}).then(insertedTodo => {
        knex('tasks')
        .where('id', insertedTodo[0])
        .then(selectedTodo => {
            return response.json(selectedTodo)
        })
    })
})

router.put('/task/:id', async (request, response) => {
    const { id } = request.params;
    const { description, done } = request.body;
    
    const taskBefore = await knex('tasks').select().where({ id: id })
    await knex('tasks').where({ id: id }).update({ description: description, done })
    const taskAfter = await knex('tasks').select().where({ id: id })

    response.json({
        tarefa_antes: taskBefore,
        tarefa_depois: taskAfter
    })
})

router.patch('/task/done/:id', async (request, response) => {
    const { id } = request.params;

    const taskBefore = await knex('tasks').select().where({ id: id })
    await knex('tasks').where({ id: id }).update({ done: true })
    const taskAfter = await knex('tasks').select().where({ id: id })

    response.json({
        tarefa_antes: taskBefore,
        tarefa_depois: taskAfter
    })
})

router.delete('/task/:id', async (request, response) => {
    const { id } = request.params;

    await knex('tasks').where({ id: id }).del()

    response.json({ message: `Task with id: ${id} deleted` })
})

module.exports = router