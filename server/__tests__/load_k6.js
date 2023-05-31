/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-use-before-define */
import http from 'k6/http';
import { sleep, check } from 'k6';

// EXAMPLE FROM THE K6 LEARN:

// export default function() {
//   let url = 'https://httpbin.test.k6.io/post';
//   let response = http.post(url, 'Hello world!');
//   // console.log(response.json().data);
//   check(response, {
//     'Application says hello': (r) => r.body.includes('Hello world!')
//   });
// }

// set threshold goals (if reached, test aborts/fails)
// set up variety of test scenarios (stress, spike, breakpoint)
export const options = {
  // throughput: 100RPS/sec
  thresholds: {
    http_req_duration: [{
      threshold: 'p(95) < 2000', // 95% of request latency should be below 2000ms
      abortOnFail: true,
    }],
    http_req_failed: [{
      threshold: 'rate < 0.01', // http errors should be less than 1%
      abortOnFail: true,
    }],
  },
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
  // stages: [
  //   { duration: '1s', target: 1 },
  //   { duration: '28s', target: 10 },
  //   { duration: '1s', target: 1 },
  // ],
};

// Any code in default fn is executed by each k6 VU when the test runs
export default function() {
  getQuestions();
  // getAnswers();
  // postQuestion();
  // postAnswer();
  // putQuestHelpful();
  // putAnsHelpful();
  // putQuestReport();
  // putAnsReport();
}

// generate an id that will grab a random identifier
// from the last 10% of a data set.
const generateId = (id) => {
  if (id === 'productId') {
    return Math.floor(Math.random() * (1000011 - 900000 + 1) + 900000);
  }
  if (id === 'questionId') {
    return Math.floor(Math.random() * (3518963 - 3150000 + 1) + 3150000);
  }
  if (id === 'answerId') {
    return Math.floor(Math.random() * (6879296 - 6100000 + 1) + 6100000);
  }
  return null;
};

const getQuestions = () => {
  const id = generateId('productId');
  const res = http.get(`http://localhost:3500/qa/questions?product_id=${id}`);

  check(res, {
    'Should be status 200': (r) => r.status === 200,
    // 'Each res should contain data wrapped in results': (r) => r.json()["results"].length > 0,
  });
  sleep(1);
};

const getAnswers = () => {
  const id = generateId('questionId');
  const res = http.get(`http://localhost:3500/qa/questions/${id}/answers`);

  check(res, {
    'Should be status 200': (r) => r.status === 200,

  });
  sleep(1);
};

const postQuestion = () => {
  const body = {
    body: 'Is there an easy way to dispose of this trash product?',
    name: 'Smugsy',
    email: 'realemail@yahoo.com',
    product_id: generateId('questions'),
  };
  const res = http.post('http://localhost:3500/qa/questions', body);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};

const postAnswer = () => {
  const id = generateId('questionId');
  const body = {
    body: 'Whenever I have a question I am told to look at the docs...',
    name: 'sttttuuuudennt',
    email: 'student@university.com',
    photos: [],
  };
  const res = http.post(`http://localhost:3500/qa/questions/${id}/answers`, body);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};

const putQuestionHelpful = () => {
  const id = generateId('questionId');
  const res = http.put(`http://localhost3500/qa/questions/${id}/helpful`);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};

const putAnsHelpful = () => {
  const id = generateId('answerId');
  const res = http.put(`http://localhost3500/qa/answers/${id}/helpful`);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};

const putQuestReport = () => {
  const id = generateId('questionId');
  const res = http.put(`http://localhost3500/qa/questions/${id}/report`);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};

const putAnsReport = () => {
  const id = generateId('answerId');
  const res = http.put(`http://localhost3500/qa/answers/${id}/report`);

  check(res, {
    'Should be status 201': (r) => r.status === 201,
  });
};
