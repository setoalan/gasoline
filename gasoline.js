#!/usr/bin/env node

const program = require('commander');
const request = require('request');

program
  .version('0.0.1')
  .option('-s, --state [state]', 'state to search gas prices for')
  .parse(process.argv);

if (!program.state) {
  console.log('Please enter a State');
  return;
}

request(`http://gasprices.aaa.com/?state=${program.state}`, (error, response, body) => {
  const index = body.search('Current Avg.');
  const regular = body.substring(index + 43, index + 48);
  const midGrade = body.substring(index + 79, index + 84);
  const premium = body.substring(index + 115, index + 120);
  const diesel = body.substring(index + 151, index + 156);

  console.log(`Average gas prices for: ${program.state}`);
  console.log(`Regular: $${regular}`);
  console.log(`Mid-Grade: $${midGrade}`);
  console.log(`Premium: $${premium}`);
  console.log(`Diesel: $${diesel}`);
});
