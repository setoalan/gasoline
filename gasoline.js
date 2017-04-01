#!/usr/bin/env node

const program = require('commander');
const request = require('request');
const chalk = require('chalk');

const log = console.log;
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'US'
];

program
  .version('0.1.1')
  .option('-s, --state [state]', 'state to search gas prices for')
  .parse(process.argv);

if (!program.state) {
  log(chalk.red('Please enter a state abbreviation'));
  return;
} else if (!states.includes(program.state.toUpperCase())) {
  log(chalk.red(`State abbreviation not found`));
  return;
}

request(`http://gasprices.aaa.com/?state=${program.state.toUpperCase()}`, (error, response, body) => {
  const PRICE_LENGTH = 5;
  const updateIndex = body.search('Prices updated as of');
  const endUpdateIndex = body.search('m ET');
  const dateUpdated = body.substring(updateIndex + 28, endUpdateIndex + 4);
  log(chalk.magenta(`Average gas prices for ${program.state} as of ${dateUpdated}`));
  log(chalk.cyan.underline('                Regular Mid-Grade   Premium    Diesel'));

  let index = body.search('Current Avg.');
  let regular = body.substr(index + 43, PRICE_LENGTH);
  let midGrade = body.substr(index + 79, PRICE_LENGTH);
  let premium = body.substr(index + 115, PRICE_LENGTH);
  let diesel = body.substr(index + 151, PRICE_LENGTH);
  log(chalk.red(`Current Avg:     $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Yesterday Avg.');
  regular = body.substr(index + 45, PRICE_LENGTH);
  midGrade = body.substr(index + 81, PRICE_LENGTH);
  premium = body.substr(index + 117, PRICE_LENGTH);
  diesel = body.substr(index + 153, PRICE_LENGTH);
  log(chalk.green(`Yesterday Avg:   $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Week Ago Avg.');
  regular = body.substr(index + 44, PRICE_LENGTH);
  midGrade = body.substr(index + 80, PRICE_LENGTH);
  premium = body.substr(index + 116, PRICE_LENGTH);
  diesel = body.substr(index + 152, PRICE_LENGTH);
  log(chalk.yellow(`Week Ago Avg:    $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Month Ago Avg.');
  regular = body.substr(index + 45, PRICE_LENGTH);
  midGrade = body.substr(index + 81, PRICE_LENGTH);
  premium = body.substr(index + 117, PRICE_LENGTH);
  diesel = body.substr(index + 153, PRICE_LENGTH);
  log(chalk.blue(`Month Ago Avg:   $${regular}    $${midGrade}    $${premium}    $${diesel}`));
});
