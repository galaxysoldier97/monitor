export const K6_OPTIONS = {
  stages: [
    {duration: '5s', target: 1},
    {duration: '10s', target: 10},
    {duration: '5s', target: 0},
  ],
  thresholds: {
    http_req_failed: ['rate<0.10'], // Errors should be less than 10%
    http_req_duration: ['avg<=1500', 'max<=10000', 'p(90)<3000'],
  },
};

export const ENV = {
  APP_URL: __ENV.ENV_SERVICE_URL,
  API_URL: __ENV.ENV_API_URL,
  IAM_URL: __ENV.ENV_IAM_URL,
  CLIENT_SECRET: __ENV.ENV_CLIENT_SECRET,
  CLIENT_ID: __ENV.ENV_CLIENT_ID,
};
