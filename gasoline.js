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
  .version('0.1.0')
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
  const updateIndex = body.search('Prices updated as of');
  const endUpdateIndex = body.search('m ET');
  const dateUpdated = body.substring(updateIndex + 28, endUpdateIndex + 4);
  log(chalk.magenta(`Average gas prices for ${program.state} as of ${dateUpdated}`));
  log(chalk.cyan.underline('                Regular Mid-Grade   Premium    Diesel'));

  let index = body.search('Current Avg.');
  let regular = body.substring(index + 43, index + 48);
  let midGrade = body.substring(index + 79, index + 84);
  let premium = body.substring(index + 115, index + 120);
  let diesel = body.substring(index + 151, index + 156);
  log(chalk.red(`Current Avg:     $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Yesterday Avg.');
  regular = body.substring(index + 45, index + 50);
  midGrade = body.substring(index + 81, index + 86);
  premium = body.substring(index + 117, index + 122);
  diesel = body.substring(index + 153, index + 158);
  log(chalk.green(`Yesterday Avg:   $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Week Ago Avg.');
  regular = body.substring(index + 44, index + 49);
  midGrade = body.substring(index + 80, index + 85);
  premium = body.substring(index + 116, index + 121);
  diesel = body.substring(index + 152, index + 157);
  log(chalk.yellow(`Week Ago Avg:    $${regular}    $${midGrade}    $${premium}    $${diesel}`));

  index = body.search('Month Ago Avg.');
  regular = body.substring(index + 45, index + 50);
  midGrade = body.substring(index + 81, index + 86);
  premium = body.substring(index + 117, index + 122);
  diesel = body.substring(index + 153, index + 158);
  log(chalk.blue(`Month Ago Avg:   $${regular}    $${midGrade}    $${premium}    $${diesel}`));
});
