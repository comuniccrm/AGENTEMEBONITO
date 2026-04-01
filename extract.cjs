const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./public/tarifario.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("--- PDF START ---");
    console.log(data.text);
    console.log("--- PDF END ---");
}).catch(err => {
    console.error("Error reading PDF:", err);
});
