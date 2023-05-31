/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const { app } = require('../index');

module.exports = () => {
  describe('Should correctly route and respond to requests for Questions', () => {
    test('Should respond with a 200 status code for getting all questions', async () => {
      const response = await request(app).get('/qa/questions').send(
        {
          "product_id": 292,
          "results": [
              {
                  "question_id": 1004,
                  "question_body": "Sed voluptatem voluptas facilis nihil quis.",
                  "question_date": "2020-09-18T09:14:13.374Z",
                  "asker_name": "Marion_Schiller",
                  "quesiton_helpfulness": 18,
                  "reported": false,
                  "answers": {
                      "1959": {
                          "id": 1959,
                          "body": "Blanditiis qui cumque repudiandae dolores asperiores ut repellendus.",
                          "date": "2020-04-28T21:47:26.550Z",
                          "answerer_name": "Aniya.Tremblay55",
                          "helpfulness": 1,
                          "photos": []
                      },
                      "1960": {
                          "id": 1960,
                          "body": "Deleniti dolorem sed neque et recusandae.",
                          "date": "2020-09-08T10:20:49.552Z",
                          "answerer_name": "Werner.Zemlak28",
                          "helpfulness": 9,
                          "photos": [
                              "https://images.unsplash.com/photo-1470282312847-28b943046dc1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
                          ]
                      },
                      "1961": {
                          "id": 1961,
                          "body": "Quia aut porro.",
                          "date": "2020-06-10T06:21:07.078Z",
                          "answerer_name": "Urban.Lind",
                          "helpfulness": 3,
                          "photos": [
                              "https://images.unsplash.com/photo-1517278322228-3fe7a86cf6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
                          ]
                      }
                  }
              }
          ]
        });
      expect(response.statusCode).toBe(200);
    });
    test('Should specify json in the content type header in GET request', async () => {
      const response = await request(app).get('/qa/questions').send(
        {
          "product_id": 292,
          "results": [
              {
                  "question_id": 1004,
                  "question_body": "Sed voluptatem voluptas facilis nihil quis.",
                  "question_date": "2020-09-18T09:14:13.374Z",
                  "asker_name": "Marion_Schiller",
                  "quesiton_helpfulness": 18,
                  "reported": false,
                  "answers": {
                      "1959": {
                          "id": 1959,
                          "body": "Blanditiis qui cumque repudiandae dolores asperiores ut repellendus.",
                          "date": "2020-04-28T21:47:26.550Z",
                          "answerer_name": "Aniya.Tremblay55",
                          "helpfulness": 1,
                          "photos": []
                      },
                      "1960": {
                          "id": 1960,
                          "body": "Deleniti dolorem sed neque et recusandae.",
                          "date": "2020-09-08T10:20:49.552Z",
                          "answerer_name": "Werner.Zemlak28",
                          "helpfulness": 9,
                          "photos": [
                              "https://images.unsplash.com/photo-1470282312847-28b943046dc1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
                          ]
                      },
                      "1961": {
                          "id": 1961,
                          "body": "Quia aut porro.",
                          "date": "2020-06-10T06:21:07.078Z",
                          "answerer_name": "Urban.Lind",
                          "helpfulness": 3,
                          "photos": [
                              "https://images.unsplash.com/photo-1517278322228-3fe7a86cf6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
                          ]
                      }
                  }
              }
          ]
        });
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
    // test('Should ')
  });
};
