
// requiring path and fs modules
const path = require('path');
const fs = require('fs');
const NodeID3 = require('node-id3');


// joining path of directory
const directoryPath = path.join(__dirname);
// passsing directoryPath and callback function
const fileArr = [];
fs.readdir(directoryPath, (err, files) => {
  // handling error
  if (err) {
    return console.log(`Unable to scan directory: ${err}`);
  }

  // listing all files using forEach
  files.forEach((file) => {
    if (file.includes('.mp3')) {
      fileArr.push(file);
    }
    const arr = file.split(' - ');
    if (arr.length > 1) {
      const title = arr[1];

      fs.renameSync(file, `${title}`);
    }
  });

});
