const fs = require('fs');

const h = {
    logError: (err, req) => {
        let logData = JSON.stringify({
            time: new Date().toString(),
            error: JSON.stringify(err),
            route: req.method + " " + req.url
        });
        fs.appendFileSync('server.log', logData + "\n", (err) => {
            if (err) {
                console.log('Cannot write to file!');
            }
        })
    }
}

module.exports = h;
