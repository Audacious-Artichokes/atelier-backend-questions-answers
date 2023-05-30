const pool = require('../db_Postgres');

exports.answers = {
  getAll: (req, res) => {
    const questionId = Number(req.params.question_id);
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const offset = (page - 1) * count;

    const fullResult = {
      question: questionId,
      page,
      count,
      results: [],
    };

    pool.query(
      `SELECT *
      FROM answers
      WHERE question_id = $1
      AND reported = false
      ORDER BY question_id
      LIMIT $2 OFFSET $3`,
      [questionId, count, offset],
    )
      .then((results) => {
        const promiseMap = results.rows.map((row) => (
          new Promise((resolve, reject) => {
            const rowObj = {
              answer_id: row.id,
              body: row.body,
              date: row.date_written,
              answerer_name: row.answerer_name,
              answerer_email: row.answerer_email,
              helpfulness: row.helpful,
            };
            pool.query(
              `SELECT *
              FROM answerPhotos
              WHERE answer_id = $1`,
              [row.id],
            )
              .then((answerPhotos) => {
                const photos = answerPhotos.rows.map((photo) => (
                  {
                    id: photo.id,
                    url: photo.url.slice(1, photo.url.length - 2),
                  }
                ));
                rowObj.photos = photos;
                resolve(rowObj);
              })
              .catch((err) => reject(err));
          })
        ));
        return promiseMap;
      })
      .then((promises) => {
        const responseObj = Promise.all(promises);
        return responseObj;
      })
      .then((ansAndPhotos) => {
        fullResult.results = fullResult.results.concat(ansAndPhotos);
        res.status(200).send(fullResult);
      })
      .catch((err) => res.status(500).send(`UNABLE TO QUERY: ${err}`));
  },
  addAnswer: (req, res) => {
    const questionId = req.params.question_id;
    const {
      body, name, email, photos,
    } = req.body;
    const timestamp = new Date(Date.now() * 1).toISOString();

    const answerQuery = `
    WITH ins1 AS (
      INSERT INTO answers
        (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
      VALUES
        (${questionId}, '${body}', '${timestamp}', '${name}', '${email}', false, 0)
      RETURNING id
    )
    INSERT INTO answerPhotos (answer_id, url)
    VALUES`;

    const photoQuery = photos.map((photo) => (`((SELECT id FROM ins1), '${photo.url}')`)).join(', ');

    pool.query(`${answerQuery} ${photoQuery};`)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(500).send(err));
  },
  markAsHelpful: (req, res) => {
    const answerId = Number(req.params.answer_id);
    pool.query(
      `UPDATE answers
      SET helpful = helpful + 1
      WHERE id = $1`,
      [answerId],
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(500).send(err));
  },
  report: (req, res) => {
    const answerId = Number(req.params.answer_id);
    pool.query(
      `UPDATE answers
      SET reported = true
      WHERE id = $1`,
      [answerId],
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(500).send(err));
  },
};
