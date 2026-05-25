const baseUrl = 'https://api.midasfun.com/api/';

async function test() {
    try {
        console.log("Logging in...");
        const loginUrl = `${baseUrl}Login/CheckLogin?Username=rahul&Password=123`;
        const loginRes = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const loginData = await loginRes.json();
        const actualToken = loginData.token;
        const branchId = 1030;

        const invalidFTime = '25-05-2026';
        const invalidTTime = '28-05-2026';
        const validFTime = '2026-05-25';
        const validTTime = '2026-05-28';

        const endpoints = [
            'Report/GameRevenueReport',
            'Report/SalesReport',
            'Report/RechargeReport'
        ];

        for (const endpoint of endpoints) {
            console.log(`\n--- Testing ${endpoint} ---`);
            
            // Test with invalid format (DD-MM-YYYY)
            const badUrl = `${baseUrl}${endpoint}?fTime=${invalidFTime}&tTime=${invalidTTime}&BranchId=${branchId}`;
            const badRes = await fetch(badUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${actualToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            console.log("DD-MM-YYYY format Status:", badRes.status);
            if (badRes.status === 400) {
                console.log("DD-MM-YYYY Error response:", await badRes.text());
            }

            // Test with valid format (YYYY-MM-DD)
            const goodUrl = `${baseUrl}${endpoint}?fTime=${validFTime}&tTime=${validTTime}&BranchId=${branchId}`;
            const goodRes = await fetch(goodUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${actualToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            console.log("YYYY-MM-DD format Status:", goodRes.status);
        }

    } catch (error) {
        console.error("Error running test:", error);
    }
}

test();
