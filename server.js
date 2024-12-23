const express = require('express')
const app = express()
const port = 3001

const db = require("./models");
var cors = require('cors')

const jose = require('jose')

const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.AUTH_BASE_URL}/connect/certs`))

const { Op } = require("sequelize");

app.use(cors());
app.use(express.json());

app.get('/barks', async (_req, res) => {
  const bloopCount = await db.Bloop.count();
  res.json(bloopCount);
})

app.get('/achievements', async (_req, res) => {
  const achievements = await db.Achievement.findAll();
  const achievementNumbers = achievements.map(async achievement => await achievement.countUsers());
  Promise.allSettled(achievementNumbers).then( achievementNumbersSettled =>
    res.json({achievements: achievements, obtained: achievementNumbersSettled.map(number => number.value)})
  );
})

app.get('/stats', async (_req, res) => {
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

app.get('/user', async (req, res) => {
  let badges = [];
  try {
    const { payload } = await jose.jwtVerify(req.get("Authorization").split(" ")[1], JWKS, {
      issuer: process.env.AUTH_BASE_URL,
      audience: `${process.env.AUTH_BASE_URL}/connect/userinfo`,
    })
    badges = payload.badge_serial;
  } catch(error) {
    console.log(error);
    res.status(401).send({error: "Unauthorized"});
    return;
  }
  const settled = badges.filter(badge => badge != "").map(async badge => {
    const user = await db.User.findOne({where: { uid: badge.replaceAll(":", "") }, include: [{model: db.Achievement, through: {attributes: []}}] });
    const bloopCount = await user.countBloops();
    return { user: user, bloopCount: bloopCount };
  });
  let sent = false;
  await Promise.allSettled(settled).then(settledBadges => {
    settledBadges.forEach(badge => {
      if (badge.status == "fulfilled"){
        sent = true;
        res.json(badge.value);
        return;
      }
    })
  })
  if (!sent)
    res.status(500).send({error: "No user found"});
})

app.listen(port, () => {
  console.log(`Bloop API listening on port ${port}`)
})