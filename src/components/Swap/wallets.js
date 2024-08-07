import fs from 'fs/promises';
import fetch from 'node-fetch';

async function fetchAccountAssets(principal) {
    const baseUrl = 'https://api.mainnet.hiro.so';
    const endpoint = `/extended/v1/address/${principal}/assets`;


    const url = baseUrl + endpoint;
    
    const baseUrl2 = 'https://docs-demo.stacks-mainnet.quiknode.pro';
    const endpoint1 = `/extended/v1/address/${principal}/assets`;

    const url2 = baseUrl2 + endpoint1

    try {
        const response = await fetch(url);

        const data = await response.json();
        const filteredAssets = data.results.filter(asset =>
            asset.asset.asset_id === 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin::liquid-staked-odin'
        );
        const extractedData = filteredAssets.map(asset => {
            return {
                recipient: asset.asset.recipient,
                amount: asset.asset.amount
            };
        });
        return extractedData;
    } catch (error) {
        console.error('Error fetching account assets:', error);
        return null;
    }
}

async function fetchAssetsForAllPrincipals() {
    try {
        const principalsData = await fs.readFile('transactions_SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin.json', 'utf8');
        const principals = JSON.parse(principalsData);

        const results = {};
        for (const principal of principals) {
            const assets = await fetchAccountAssets(principal);
            results[principal] = assets;
        }

        await fs.writeFile('assets.json', JSON.stringify(results, null, 2), 'utf8');
        console.log('Assets saved to assets.json');
    } catch (error) {
        console.error('Error processing principals:', error);
    }
}

// Run the function to fetch assets for all principals
fetchAssetsForAllPrincipals();
