import fs from 'fs';
import pdfParse from 'pdf-parse';

async function read() {
  try {
    const dataBuffer = fs.readFileSync('./public/tarifario.pdf');
    const data = await pdfParse(dataBuffer);
    console.log("--- TEXT START ---");
    console.log(data.text);
    console.log("--- TEXT END ---");
  } catch (e) {
    console.error("ERROR:", e);
  }
}
read();
