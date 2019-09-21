#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const NodeID3 = require('node-id3');
const inquirer = require('inquirer');

const directoryPath = process.cwd();
const fileArr = [];


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

function getMp3Files(files) {
  return files.filter(file => file.includes('.mp3'));
}

function getConflicts(mp3Files) {
  let num = 0;
  const conflictFiles = [];

  const quests = mp3Files.map((file, index) => {
    const metaData = NodeID3.read(file);
    const [artist, title] = file.split(' - ');

    if (file.includes('.mp3') && file.includes(' - ')) {
      fileArr.push(file);
      if (metaData.title && metaData.artist && !!title) {
        const titleStripped = title.slice(0, title.indexOf('.mp3'));
        // console.log(titleStripped != metaData.title);
        if (titleStripped !== metaData.title) {
          conflictFiles.push(file);
          const quest = getQuestion(titleStripped, metaData.title, num);
          num++;
          return quest;
        }
      }
    }
  });

  return {
    conflictFiles,
    quests,
  };
}

function getAllFiles() {
  return fs.readdirSync(directoryPath);
}


fs.readdir(directoryPath, (err, files) => {


  // notChanged.push(file);


  // console.log(chalk.white(`${notChanged.length} files will not be changed`));
});

function main() {
  const allFiles = getAllFiles();
  const mp3s = getMp3Files(allFiles);
  const conflicts = getConflicts(mp3s);
  const questions = conflicts.quests.filter(con => con !== undefined);
  const filesToChange = mp3s.filter(file => !conflicts.conflictFiles.includes(file));


  filesToChange.forEach((file) => {
    const [artist, title] = file.split(' - ');
    if (artist === undefined || title === undefined) return;
    if (!file || file === undefined) return;
    const titleStripped = title.slice(0, title.indexOf('.mp3'));

    console.log('Reading: ', file);

    const metaData = NodeID3.read(file);
    console.log('READ: ', metaData.raw);

    if (!metaData.title || !!metaData.title.length) {
      console.log('UPDATING: ');

      NodeID3.update({
        title,
      }, file);
    }
    if (!metaData.artist || !!metaData.artist.length) {
      NodeID3.update({
        artist,
      }, file);
    }


    fs.renameSync(file, titleStripped);
  });

  inquirer.prompt(questions)
    .then((answers) => {
      const files = conflicts.conflictFiles;

      files.forEach((file, index) => {
        const [artist, title] = file.split(' - ');

        if (artist === undefined || title === undefined) return;

        const metaData = NodeID3.read(file);

        if (!metaData.title || !!metaData.title.length) {
          NodeID3.update({
            title: answers[index],
          }, file);
        }
        if (!metaData.artist || !!metaData.artist.length) {
          NodeID3.update({
            artist,
          }, file);
        }
        fs.renameSync(file, answers[index]);
      });
    });


  console.log(chalk.bgWhite('DONE!'));
}

main();
