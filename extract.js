import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const dataBuffer = fs.readFileSync('./public/tarifario.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(err => {
    console.error("Error reading PDF:", err);
});
