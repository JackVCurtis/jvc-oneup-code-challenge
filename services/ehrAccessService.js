const authService = require('./authService');

const systemIds = [4707];

const ehrAccessService = {
    getLoginUrls: () => {
        return systemIds.map(id => {
            return `https://quick.1up.health/connect/${id}?access_token=${authService.accessToken}`;
        })
    }
};

module.exports = ehrAccessService;