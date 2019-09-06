
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

    // Do whatever you want to do with the file

    const tags1 = NodeID3.read(file);
    console.log(tags1);

    // console.log('True', file);

    const arr = file.split(' - ');
    if (arr.length > 1) {
      const title = arr[1];
      const artist = arr[0];
      console.log(arr);
      


      // const success = NodeID3.update(tags, file);
      // NodeID3.update(tags, file, (err, buffer) => {
      //   console.log(err);
      // });
      // console.log(success);

      // fs.renameSync(file, `${title}`);
    }
  });

  console.log(fileArr);
});
