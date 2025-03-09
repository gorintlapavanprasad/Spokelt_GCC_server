const ffmpeg = require('fluent-ffmpeg');

async function convertAudioToM4A(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('aac')
            .toFormat('mp4')
            .on('end', () => {
                console.log('Conversion finished!');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { convertAudioToM4A }; // Correct export syntax