const pool = require('../db_Postgres');
// HELPFUL: https://shusson.info/post/building-nested-json-objects-with-postgres

exports.questions = {
  getAll: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const product = req.query.product_id;
    const offset = (page - 1) * count;

    pool.query(
      `SELECT
        product_id,
        (SELECT json_agg(
          json_build_object(
            'question_id', id,
            'question_body', body,
            'question_date', date_written,
            'asker_name', asker_name,
            'quesiton_helpfulness', helpful,
            'reported', reported,
            'answers', (SELECT COALESCE(json_object_agg(
              id, json_build_object(
                'id', id,
                'body', body,
                'date', date_written,
                'answerer_name', answerer_name,
                'helpfulness', helpful,
                'photos', (SELECT COALESCE(json_agg(url), '[]' ) FROM answerphotos WHERE answer_id = answers.id)
              )
            ), '{}') FROM answers WHERE question_id = questions.id)
          )
        )) AS results
        FROM questions
        WHERE product_id = $1
        AND reported = false
        GROUP BY product_id
        LIMIT $2
        OFFSET $3;`,
      [product, count, offset],
    )
      .then((results) => {
        res.status(200).send(results.rows[0]);
      })
      .catch((err) => res.status(500).send(err));
  },
  addQuestion: (req, res) => {
    const product = req.body.product_id;
    const { body, name, email } = req.body;
    const timestamp = new Date(Date.now() * 1).toISOString();

    pool.query(
      `INSERT INTO questions
        (product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES
        ($1, $2, $3, $4, $5, false, 0)`,
      [product, body, timestamp, name, email],
    )
      .then(() => res.sendStatus(201))
      .catcgh((err) => res.status(500).send(err));
  },
  markAsHelpful: (req, res) => {
    const questionId = Number(req.params.question_id);
    pool.query(
      `UPDATE questions
      SET helpful = helpful + 1
      WHERE id = $1`,
      [questionId],
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(500).send(err));
  },
  report: (req, res) => {
    const questionId = Number(req.params.question_id);
    pool.query(
      `UPDATE questions
      SET reported = true
      WHERE id = $1`,
      [questionId],
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => res.status(500).send(err));
  },
};
