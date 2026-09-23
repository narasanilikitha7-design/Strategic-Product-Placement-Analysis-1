const fs = require('fs');

if (fs.existsSync('temp_page.html')) {
    const content = fs.readFileSync('temp_page.html', 'utf8');
    console.log("File exists!");
    console.log("Size: " + content.length);
    console.log("First 1000 chars:\n" + content.substring(0, 1000));
} else {
    console.log("File does not exist!");
} 
