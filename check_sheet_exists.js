const https = require('https');
const fs = require('fs');

const workbook = 'StrategicProductPlacementAnalysis_17841243451330';
const sheetsToTest = [
    'Story9',
    'Story_9',
    'Story',
    'Story1',
    'Story_1',
    'Dashboard',
    'Dashboard1',
    'Dashboard_1',
    'Dashboard2',
    'Dashboard_2',
    'ProductPlacementAnalysisDashboard',
    'ProductPlacementAnalysis',
    'Product_Placement_Analysis',
    'Product_Placement_Analysis_Dashboard',
    'AvgSalesVolumebyProductCategorybyProductPosition',
    'FootTrafficbyAvgSalesVolume',
    'Foot_Traffic_by_Avg_Sales_Volume',
    'Avg_Sales_Volume_by_Product_Category_by_Product_Position',
    'Sheet1',
    'Sheet_1'
];

function checkSheet(sheet) {
    const url = `https://public.tableau.com/views/${workbook}/${sheet}`;
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            resolve({ sheet, status: res.statusCode, location: res.headers.location });
        }).on('error', (err) => {
            resolve({ sheet, error: err.message });
        });
    });
}

async function run() {
    console.log("Probing sheet names...");
    const results = [];
    for (const sheet of sheetsToTest) {
        const res = await checkSheet(sheet);
        results.push(res);
        console.log(`Sheet: ${res.sheet} -> Status: ${res.status}`);
    }
    fs.writeFileSync('sheet_probe_results.json', JSON.stringify(results, null, 2), 'utf-8');
    console.log("Saved results to sheet_probe_results.json");
}

run();
