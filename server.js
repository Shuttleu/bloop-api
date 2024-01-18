const express = require('express')
const app = express()
const port = 3000

const db = require("./models");

app.get('/users', async (req, res) => {
  const users = await db.User.findAll();
  res.json(users);
})

app.get('/users/achievements', async (req, res) => {
  const userAchievements = await db.User.findAll({include: [db.Achievement]});
  res.json(userAchievements);
})

app.get('/achievements', async (req, res) => {
  const achievements = await db.Achievement.findAll();
  res.json(achievements);
})

app.get('/user/:id', async (req, res) => {
  const user = await db.User.findByPk(req.params.id, {include: [db.Achievement]});
  res.json(user);
})

app.listen(port, () => {
  console.log(`Bloop API listening on port ${port}`)
})