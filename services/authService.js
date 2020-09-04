const https = require('https');
const formurlencoded = require('form-urlencoded').default;
const USER_CODE = '1b399f7bc108472abbf62253e12a9d03'

const postOneUpOauth = (dataObj) => {
    return new Promise((resolve, reject) => {
        const data = formurlencoded(dataObj);

        const options = {
            hostname: 'api.1up.health',
            port: 443,
            path: '/fhir/oauth2/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length,
                'Accept': '*/*'
            }
        }
        
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', d => {
                resolve(d.toString());
            })
        })
        
        req.on('error', error => {
            reject(error);
        })

        req.write(data);
        
        req.end()
    })
}

const authService = {
    clientId: process.env.ONEUP_CLIENT_ID,
    clientSecret: process.env.ONEUP_CLIENT_SECRET,
    accessToken: null,
    accessTokenExpiration: null,
    refreshToken: null,
    setTokenData: (accessTokenData) => {
        const data = JSON.parse(accessTokenData);
        authService.accessToken = data["access_token"];
        authService.accessTokenExpiration =  Date.now() + (data["expires_in"] * 1000);
        authService.refreshToken = data["refresh_token"];
        console.log(authService);
    },
    login: async () => {
        const accessTokenData = await authService.getAccessToken();
        authService.setTokenData(accessTokenData);
    },
    refresh: async () => {
        const accessTokenData = await authService.refreshAccessToken();
        authService.setTokenData(accessTokenData);
    },
    getAccessToken: () => {
        return postOneUpOauth({
            client_id: authService.clientId,
            client_secret: authService.clientSecret,
            code: USER_CODE,
            grant_type: 'authorization_code'
        });
    },
    refreshAccessToken: () => {
        return postOneUpOauth({
            client_id: authService.clientId,
            client_secret: authService.clientSecret,
            refresh_token: authService.refreshToken,
            grant_type: 'refresh_token'
        });
    }
}

module.exports = authService;