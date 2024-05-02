const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const startTime = process.hrtime();
const indexedPasswords = [];

const indexDirectory = path.join(__dirname, '../Index');
const indexedFiles = fs.readdirSync(indexDirectory);

indexedFiles.forEach(folderName => {
  const folderPath = path.join(indexDirectory, folderName);
  const files = fs.readdirSync(folderPath);

  files.forEach(fileName => {
    const filePath = path.join(folderPath, fileName);
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    lines.some(line => {
      const storedPassword = line.split('|')[0];

      indexedPasswords.push(storedPassword); 
    });
  });
});

function indexPasswords(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    
    lines.forEach(line => {
      const password = line.trim();
      
      if (password && !indexedPasswords.includes(password)) { 
        let firstChar = password.charAt(0).toLowerCase();           
        
        if (/[^^\w\d]/.test(firstChar)) {
          firstChar = '@';
        }
        
        const indexFolder = path.join(__dirname, '../Index', firstChar);

        let index = 1;
        let fileName = `${firstChar}-passwords${index}.txt`;
        let indexFilePath = path.join(indexFolder, fileName);
        
        fs.mkdirSync(indexFolder, { recursive: true });
        
        while (fs.existsSync(indexFilePath)) {
          const dataCurrent = fs.readFileSync(indexFilePath, 'utf8');
          const linesCurrent = dataCurrent.split('\n');
          const fileSizeInLines = linesCurrent.length;
          
          if (fileSizeInLines > 10000) {
            index++;
            indexFilePath = path.join(indexFolder, `${firstChar}-passwords${index}.txt`);
          } else {
            break;
          }
        }

        const passwordEntry = `${password}|${hash(password, 'md5')}|${hash(password, 'sha1')}|${hash(password, 'sha256')}|${file}`;
        fs.appendFileSync(indexFilePath, passwordEntry + '\n');         
           
        indexedPasswords.push(password)
        
      }
    });

    const destinationPath = path.join(__dirname, '../Processed', file);    
    fs.renameSync(filePath, destinationPath);
  }); 
}

function hash(text, algorithm) {
  return crypto.createHash(algorithm).update(text).digest('hex');
}

indexPasswords(path.join(__dirname, '../Unprocessed-Passwords'));

function calculateExecutionTime(startTime) {
  const endTime = process.hrtime(startTime);
  const executionTimeInSeconds = endTime[0] + endTime[1] / 1e9;
  return executionTimeInSeconds.toFixed(2);
}

const executionTime = calculateExecutionTime(startTime);
console.log(executionTime);