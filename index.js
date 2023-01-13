const express = require("express");
const { Op } = require("sequelize");
const app = express();
const { Joke } = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  let jokes = [];
  try {
    if (Object.keys(req.query).length === 0) {
      jokes = await Joke.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).send(jokes);
      return;
    }
    if (req.query.tags) {
      console.log("");
      if (Array.isArray(req.query.tags)) {
        const arr = req.query.tags;

        joinedArr = arr.join(",");

        jokes = await Joke.findAll({
          where: {
            [Op.or]: [{ tags: arr[0] }, { tags: arr[1] }],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        res.status(200).send(jokes);
        return;
      } else {
        const str = req.query.tags;
        jokes = await Joke.findAll({
          where: {
            tags: {
              [Op.like]: "%" + req.query.tags + "%",
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        res.status(200).send(jokes);
        return;
      }
    }

    if (req.query.content) {
      console.log(req.query);
      jokes = await Joke.findAll({
        where: {
          joke: {
            [Op.like]: "%" + req.query.content + "%",
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).send(jokes);
    }

    // TODO - filter the jokes by tags and content
  } catch (error) {
    console.log(error);
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
