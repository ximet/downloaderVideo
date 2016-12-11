const fs = require('fs')
const fetch = require('node-fetch');

function getTrace () {
  return fetch('https://trace.risingstack.com', {
    method: 'get'
  })
}

getTrace()
  .then(item => console.log(item))
  .catch(error => console.log(error));
