const fs = require("fs");
const path = require("path");

const directoryPath = "src"; 
const searchCharacter = new RegExp("/{2}[^s]", "g");
const replaceCharacter = "// ";

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file) {
    const filePath = path.join(directoryPath, file);
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log("Error reading file: " + err);
      }
      const result = data.replace(searchCharacter, (a) => {
        return a.trim().length === 3
          ? replaceCharacter + a.trim().substring(a.length - 1)
          : replaceCharacter;
      });
      fs.writeFile(filePath, result, "utf8", function (err) {
        if (err) {
          return console.log("Error writing file: " + err);
        }
      });
    });
  });
});