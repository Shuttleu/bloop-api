const express = require('express')
const app = express()
const port = 80

const db = require("./models");
var cors = require('cors')

const { Op } = require("sequelize");

app.use(cors());

app.get('/users', async (req, res) => {
  const users = await db.User.findAll({ where: { cardId: { [Op.not]: 0 } } });
  res.json(users);
})

app.get('/barks', async (req, res) => {
  const bloopCount = await db.Bloop.count();
  res.json(bloopCount);
})

app.get('/users/achievements', async (req, res) => {
  const userAchievements = await db.User.findAll({ where: { cardId: { [Op.not]: 0 } }, include: [db.Achievement] });
  res.json(userAchievements);
})

app.get('/achievements', async (req, res) => {
  const achievements = await db.Achievement.findAll();
  res.json(achievements);
})

app.get('/stats', async (req, res) => {
    let boxNumbers = [];
    const boxes = await db.Box.findAll();
    const boxCount = await db.Box.count();
    const bloopCount = await db.Bloop.count();
    const userCount = await db.User.count();
    for (let box in boxes) {
        const boxBloopCount = await boxes[box].countBloops();
        boxNumbers.push({ name: boxes[box].name, count: boxBloopCount });

    }
    res.json({
        bloopsPerBox: boxNumbers,
        numberOfBloops: bloopCount,
        meanPerBox: Math.floor(bloopCount/boxCount),
        numberOfUsers: userCount,
        meanPerUser: Math.floor(bloopCount/userCount)
    });
})

app.get('/user/:id', async (req, res) => {
  const user = await db.User.findByPk(req.params.id, { include: [db.Achievement] });
  const bloopCount = await user.countBloops();
  res.json({ user: user, bloopCount: bloopCount });
})

app.listen(port, () => {
  console.log(`Bloop API listening on port ${port}`)
})