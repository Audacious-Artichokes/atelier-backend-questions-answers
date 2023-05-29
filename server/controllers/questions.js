const pool = require('../db_Postgres');
// HELPFUL: https://shusson.info/post/building-nested-json-objects-with-postgres

exports.questions = {
  getAll: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const product = req.query.product_id;
    const offset = (page - 1) * count;

    const quests = [];
    pool.query(
      `SELECT *
      FROM questions
      WHERE product_id = $1
      ORDER BY question_id
      LIMIT $2 OFFSET $3`,
      [product, count, offset],
    )
      .then((results) => {
        console.log('RESULTS FROM QUERY ', results);
      });

    // input: product_id, page || 1, count || 5 as parameters
    // output : { product_id: #, results: [{THE WHOLE THING}]}
    // send back get request in the form of results (results.data.results, an arr)
  },
  addQuestion: (req, res) => {
    console.log('POST REQ FOR QUESTION ', req.body)
    //posting coming in with {...question, product_id}
    // productId, body, name, email
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
