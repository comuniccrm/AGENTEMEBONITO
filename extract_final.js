import fs from 'fs';

const dataBuffer = fs.readFileSync('public/tarifario.pdf');

import('pdf-parse').then(m => {
  const parse = m.default || m;
  if(typeof parse !== 'function') {
      console.log("Parse is not a function:", parse);
      return;
  }
  parse(dataBuffer).then(data => {
    console.log("===TEXT===");
    console.log(data.text);
    console.log("===END===");
  }).catch(e => console.error("Parse inner error:", e));
}).catch(e => {
    console.log("Dynamic import error:", e);
});
