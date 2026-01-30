const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');
const { mongo } = require('mongoose');

let currentCount = 0;
/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  currentCount = parseInt(await redis.getAsync('added_todos')) || 0;
  await redis.setAsync('added_todos', currentCount + 1);
  
  res.send(todo);
});

router.get('/statistics', async (req, res) => {
  const todosFromRedis = await redis.getAsync('added_todos');
  res.send({ added_todos: todosFromRedis || 0 })
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  currentCount = parseInt(await redis.getAsync('added_todos')) || 0;
  await redis.setAsync('added_todos', Math.max(0, currentCount - 1));
  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
  res.status(200);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.text = req.body.text
  req.todo.done = req.body.done
  await req.todo.save()
  res.send(req.todo);
  res.status(200);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
