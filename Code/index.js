const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Dosya okuma ve parolaları indexleme fonksiyonu
function indexPasswords(directory) {
  const files = fs.readdirSync(directory);
  const indexedPasswords = new Set(); // Bir kez indekslenen şifreleri takip etmek için bir Set kullanıyoruz
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    lines.forEach(line => {
      const password = line.trim();

      if (password && !indexedPasswords.has(password)) { // Eğer şifre daha önce indekslenmediyse devam et
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
          const data = fs.readFileSync(indexFilePath, 'utf8');
          const lines = data.split('\n');
          const fileSizeInLines = lines.length;
          
          if (fileSizeInLines > 10000) {
            index++;
            indexFilePath = path.join(indexFolder, `${firstChar}-passwords${index}.txt`);
          } else {
            break;
          }
        }

        for (let i = 1; i <= index; i++) {
          indexPath4Control = path.join(indexFolder, `${firstChar}-passwords${i}.txt`)

          if (typeof isPasswordInFile === 'undefined') {
            const passwordEntry = `${password}|${hash(password, 'md5')}|${hash(password, 'sha1')}|${hash(password, 'sha256')}|${file}`;
            fs.appendFileSync(indexFilePath, passwordEntry + '\n');
            indexedPasswords.add(password); // Şifreyi indekslendi olarak işaretle
          } else {
            const isPasswordExists = isPasswordInFile(password, indexFilePath);           
            // Şifrenin dosyada olup olmadığını kontrol et
            if (!isPasswordExists) {
              const passwordEntry = `${password}|${hash(password, 'md5')}|${hash(password, 'sha1')}|${hash(password, 'sha256')}|${file}`;
              fs.appendFileSync(indexFilePath, passwordEntry + '\n');
            }
          }
        }      
      }
    });
  }); 
}

// Hash fonksiyonu
function hash(text, algorithm) {
  return crypto.createHash(algorithm).update(text).digest('hex');
}

// Dosya içinde şifrenin var olup olmadığını kontrol etme fonksiyonu
// function isPasswordInFile(password, filePath) {
//   if (fs.existsSync(filePath)) {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     return lines.some(line => {
//       const storedPassword = line.split('|')[0];
//       return storedPassword === password;
//     });
//   }
//   return false;
// }

// Dosya okuma ve parolaları indexleme işlemini başlatma
indexPasswords(path.join(__dirname, '../Unprocessed-Passwords'));
