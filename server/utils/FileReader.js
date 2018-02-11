const fs = require('fs');

module.exports = class FileReader {
    sendFile (fileName, res) {
        const fileStream = fs.createReadStream(fileName);
        fileStream
            .on('error', () => {
                res.statusCode = 500;
                res.end("Server error");
            })
            .pipe(res)
            .on('close', () => {
                fileStream.destroy();
            });
    }
};
