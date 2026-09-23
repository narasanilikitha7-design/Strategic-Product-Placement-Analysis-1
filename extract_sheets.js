const fs = require('fs');

try {
    const html = fs.readFileSync('temp_page.html', 'utf8');

    // Search for any JSON blocks in the HTML, particularly within script tags or textarea
    console.log("File size: " + html.length);

    // Tableau often puts config inside a <textarea id="respondData"> or in window.vizShell or in a script block.
    // Let's find script blocks or elements
    const respondDataRegex = /<textarea[^>]*id="respondData"[^>]*>([\s\S]*?)<\/textarea>/i;
    const match = html.match(respondDataRegex);

    if (match) {
        console.log("Found respondData element!");
        const data = JSON.parse(match[1]);
        if (data && data.models) {
            fs.writeFileSync('parsed_respond.json', JSON.stringify(data, null, 2));
            console.log("Saved parsed respondData to parsed_respond.json");
        }
    } else {
        console.log("respondData element not found. Looking for other telltale strings...");
    }

    // Let's search for sheetName patterns
    const sheetNames = [];
    const regex = /"sheetName"\s*:\s*"([^"]+)"/g;
    let reMatch;
    while ((reMatch = regex.exec(html)) !== null) {
        sheetNames.push(reMatch[1]);
    }
    console.log("Found sheetNames: " + JSON.stringify([...new Set(sheetNames)]));

    // Let's also look for workbook name and views in general strings
    const workbookRegex = /"workbookName"\s*:\s*"([^"]+)"/g;
    const workbooks = [];
    while ((reMatch = workbookRegex.exec(html)) !== null) {
        workbooks.push(reMatch[1]);
    }
    console.log("Found workbookNames: " + JSON.stringify([...new Set(workbooks)]));

} catch (err) {
    console.error("Error: ", err);
}
