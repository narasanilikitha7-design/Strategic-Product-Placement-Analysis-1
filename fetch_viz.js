const https = require('https');
const fs = require('fs');

function getUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            console.log(`FETCH: ${url} -> Status: ${res.statusCode}`);
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (redirectUrl.startsWith('/')) {
                    redirectUrl = 'https://public.tableau.com' + redirectUrl;
                }
                resolve(getUrl(redirectUrl));
            } else {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }
        }).on('error', reject);
    });
}

getUrl('https://public.tableau.com/views/StrategicProductPlacementAnalysis_17841243451330/Story9')
    .then(html => {
        fs.writeFileSync('temp_page.html', html);
        console.log(`Saved HTML of size: ${html.length}`);

        // Parse sheet details
        const sheetNames = [];
        let match;
        const regex = /"sheetName"\s*:\s*"([^"]+)"/g;
        while ((match = regex.exec(html)) !== null) {
            sheetNames.push(match[1]);
        }
        console.log("Raw sheet names: " + JSON.stringify([...new Set(sheetNames)]));

        // Look for list of views/tabs
        // Tableau public config includes "tabs" metadata, look for sheet names inside:
        // "workbookName" or "sheetRepoUrl" in JSON block
        const urls = [];
        const urlRegex = /"sheetRepoUrl"\s*:\s*"([^"]+)"/g;
        while ((match = urlRegex.exec(html)) !== null) {
            urls.push(match[1]);
        }
        console.log("Sheet repo URLs: " + JSON.stringify([...new Set(urls)]));
    })
    .catch(err => console.error("Error: ", err));
