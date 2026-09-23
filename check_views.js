const https = require('https');
const fs = require('fs');

const endpoints = [
    'https://public.tableau.com/public/apis/bff/v1/workbook/StrategicProductPlacementAnalysis_17841243451330',
    'https://public.tableau.com/public/apis/bff/v2/workbook/StrategicProductPlacementAnalysis_17841243451330',
    'https://public.tableau.com/public/apis/bff/v1/workbooks/StrategicProductPlacementAnalysis_17841243451330',
    'https://public.tableau.com/public/apis/bff/v2/workbooks/StrategicProductPlacementAnalysis_17841243451330',
    'https://public.tableau.com/profile/api/single_workbook/StrategicProductPlacementAnalysis_17841243451330',
    'https://public.tableau.com/profile/api/single_workbook/StrategicProductPlacementAnalysis_17841243451330/views',
    'https://public.tableau.com/public/apis/bff/v2/author/anthony.cypriyan/categories?startIndex=0&pageSize=10'
];

function fetch(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    url,
                    status: res.statusCode,
                    length: data.length,
                    data: data
                });
            });
        }).on('error', (err) => {
            resolve({ url, error: err.message });
        });
    });
}

async function run() {
    console.log("Analyzing views endpoints...");
    const results = [];
    for (const url of endpoints) {
        const res = await fetch(url);
        results.push({
            url: res.url,
            status: res.status,
            length: res.length,
            data: res.status === 200 ? JSON.parse(res.data) : res.data.substring(0, 500)
        });
    }
    fs.writeFileSync('views_check.json', JSON.stringify(results, null, 2), 'utf-8');
    console.log("Done. Results saved to views_check.json");
}

run();
