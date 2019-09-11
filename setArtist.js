#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const NodeID3 = require('node-id3');
const inquirer = require('inquirer');

const directoryPath = process.cwd();
const fileArr = [];
const notChanged = [];


function getQuestion(title1, title2, index) {
  const question = {
    type: 'list',
    message: 'Conflict: Choose Title',
    name: `${index}`,
    choices: [
      title1,
      title2,
    ],
  };
  return question;
}


fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log(chalk.bgRed(`Unable to scan directory: ${chalk.red(err)}`));
  }
  let num = 0;
  const conflicts = files.map((file) => {
    const metaData = NodeID3.read(file);
    const [artist, title] = file.split(' - ');
  

    if (file.includes('.mp3') && file.includes(' - ')) {
      fileArr.push(file);
      if (metaData.title && metaData.artist) {
        const titleStripped = title.slice(0, title.indexOf('.mp3'));
        // console.log(titleStripped != metaData.title);
        if (titleStripped !== metaData.title) {
          console.log(num);
          console.log(metaData);
          
          const quest = getQuestion(titleStripped, metaData.title, num);
          num++;
          return quest;
        }
      }
    }
    notChanged.push(file);
  });


  const questions = conflicts.filter(con => con !== undefined);
  console.log(questions);

  inquirer.prompt(questions)
    .then((answers) => {
      console.log(answers);
    });

  // notChanged.push(file);


  // console.log(chalk.white(`${notChanged.length} files will not be changed`));
});
