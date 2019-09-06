
// requiring path and fs modules
const path = require('path');
const fs = require('fs');
const NodeID3 = require('node-id3');


// joining path of directory
const directoryPath = path.join(__dirname);
// passsing directoryPath and callback function
fs.readdir(directoryPath, (err, files) => {
  // handling error
  if (err) {
    return console.log(`Unable to scan directory: ${err}`);
  }
  // listing all files using forEach
  files.forEach((file) => {
    // Do whatever you want to do with the file
    if (file.includes('.mp3')) {
      const tags1 = NodeID3.read(file);
      console.log(tags1);

      console.log('True', file);

      const arr = file.split(' - ');
      const title = arr[1];
      const artist = arr[0];
      console.log(arr);
      const tags = {
        title,
        artist,
        // album: 'TVアニメ「メイドインアビス」オリジナルサウンドトラック',
        // APIC: './example/mia_cover.jpg',
        // TRCK: '27',
      };

      // NEW CHANGE

      const success = NodeID3.update(tags, file); //  Returns true/false or, if buffer passed as file, the tagged buffer
      NodeID3.update(tags, file, (err, buffer) => {
        console.log(err);
      });
      console.log(success);

      fs.rename(file, `${title}`, (err) => {
        console.log('file renamed', err);
      });
    }
  });
});
