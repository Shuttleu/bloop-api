const express = require('express')
const app = express()
const port = 3000

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
  let days = [];
  for (let day = 1; day <= 5; day++) {
    days[day - 1] = { dayCount: 0, hourCount: [] };
    let dayCount = 0;
    for (let hour = 0; hour <= 23; hour++) {
      const hourCount = await db.Bloop.count({ where: { createdAt: { [Op.between]: [`2024-02-${day} ${hour}:00:00.0+00`, `2024-02-${day} ${hour}:59:59.999+00`], } } });
      dayCount += hourCount;
      days[day - 1].hourCount.push(hourCount);
    }
    days[day - 1].dayCount = dayCount;
  }
  const boxes = await db.Box.findAll();
  const boxCount = await db.Box.count();
  const bloopCount = await db.Bloop.count();
  const userCount = await db.User.count();
  let daysBoxes = {};
  for (let box in boxes) {
    for (let day = 1; day <= 5; day++) {
      daysBoxes[boxes[box].name] = []
      for (let day = 1; day <= 5; day++) {
        daysBoxes[boxes[box].name][day - 1] = { dayCount: 0, hourCount: [] };
        let dayCount = 0;
        for (let hour = 0; hour <= 23; hour++) {
          const hourCount = await boxes[box].countBloops({ where: { createdAt: { [Op.between]: [`2024-02-${day} ${hour}:00:00.0+00`, `2024-02-${day} ${hour}:59:59.999+00`], } } });
          dayCount += hourCount;
          daysBoxes[boxes[box].name][day - 1].hourCount.push(hourCount);
        }
        daysBoxes[boxes[box].name][day - 1].dayCount = dayCount;
      }

    }
    const boxBloopCount = await boxes[box].countBloops();
    boxNumbers.push({ name: boxes[box].name, count: boxBloopCount });
  }
  res.json({
    bloopsPerBox: boxNumbers,
    numberOfBloops: bloopCount,
    meanPerBox: Math.floor(bloopCount / boxCount),
    numberOfUsers: userCount,
    meanPerUser: Math.floor(bloopCount / userCount),
    bloopsPerDayHour: days,
    BloopsPerBoxDayHour: daysBoxes
  });
}
);

app.get('/user/:id', async (req, res) => {
  const user = await db.User.findByPk(req.params.id, { include: [db.Achievement] });
  const bloopCount = await user.countBloops();
  res.json({ user: user, bloopCount: bloopCount });
})

app.listen(port, () => {
  console.log(`Bloop API listening on port ${port}`)
})