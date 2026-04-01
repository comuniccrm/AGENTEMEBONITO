import fs from 'fs';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => console.error("Error:", errData.parserError));
pdfParser.on("pdfParser_dataReady", () => {
    console.log("===TEXT===");
    const text = pdfParser.getRawTextContent();
    console.log(text.substring(0, 4000)); // print first 4k chars to console
    fs.writeFileSync('extracted.txt', text); // save full to file
    console.log("===END===");
});
pdfParser.loadPDF('public/tarifario.pdf');
