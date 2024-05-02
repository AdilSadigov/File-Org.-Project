const fs = require('fs');
const path = require('path');
const addPasswords = require('./index');

const indexDirectory = path.join(__dirname, '../Index');

function searchPassword(password) {
  const firstLetter = password[0];
  const folderPath = path.join(indexDirectory, firstLetter);

  if (!fs.existsSync(folderPath)) {
    console.log(`Password "${password}" not found. It has now been added to the database.`);      
    addPasswords(password, 'fromUser')
    return;
  }

  const indexedPasswords = [];
  fs.readdirSync(folderPath).forEach(fileName => {
    const filePath = path.join(folderPath, fileName);
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    lines.forEach(line => {
      const storedPassword = line.split('|')[0];
      const hashValues = line.split('|').slice(1);
      indexedPasswords.push({ password: storedPassword, hashes: hashValues });
    });
  });

  const foundPassword = indexedPasswords.find(entry => entry.password === password);

  if (typeof readline !== 'undefined') {
    if (foundPassword) {
      console.log(`Password "${password}" found.`);
      console.log(`MD5: ${foundPassword.hashes[0]}`);
      console.log(`SHA1: ${foundPassword.hashes[1]}`);
      console.log(`SHA256: ${foundPassword.hashes[2]}`);
    } else {
      console.log(`Password "${password}" not found. It has now been added to the database.`);
      
      addPasswords(password, 'fromUser')
    }
  }
}

// ↓↓↓↓↓↓↓↓↓↓ MAKE A COMMENT WHEN TESTING ↓↓↓↓↓↓↓↓↓↓
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Please enter the password you want to find: ', password => {
  readline.close();
  searchPassword(password);
});
// ↑↑↑↑↑↑↑↑↑↑ MAKE A COMMENT WHEN TESTING ↑↑↑↑↑↑↑↑↑↑





// ↓↓↓↓↓↓↓↓↓↓ TESTING CODE ↓↓↓↓↓↓↓↓↓↓

// const indexedPasswords = [];
// const indexedFiles = fs.readdirSync(indexDirectory);

// indexedFiles.forEach(folderName => {
//   const folderPath = path.join(indexDirectory, folderName);
//   const files = fs.readdirSync(folderPath);
  
//   files.forEach(fileName => {
//     const filePath = path.join(folderPath, fileName);
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     lines.some(line => {
//       const storedPassword = line.split('|')[0];
      
//       indexedPasswords.push(storedPassword); 
//     });
//   });
// });

// const searchTimes = [];
// const numberOfPasswords = 10

// for (let i = 0; i < numberOfPasswords; i++) {
  
//   const randomIndex = Math.floor(Math.random() * indexedPasswords.length);
//   const password = indexedPasswords[randomIndex];

//   const startTime = new Date().getTime(); 
//   searchPassword(password);
//   const endTime = new Date().getTime();

//   const searchTime = endTime - startTime; 
//   searchTimes.push(searchTime); 

//   console.log(`Search time for password "${password}": ${searchTime} milliseconds`);
// }

// const averageSearchTime = searchTimes.reduce((total, time) => total + time, 0) / searchTimes.length;
// console.log(`Average search time for ${numberOfPasswords} passwords: ${averageSearchTime} milliseconds`);