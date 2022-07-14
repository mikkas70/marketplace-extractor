import fs from "fs";

/**
 * Ensure a directory exists.
 * @param path
 */
const ensureDirectoryExists = (path: string) => {
    if (fs.existsSync(path)) {
        return;
    }

    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            console.log('Could not create ' + path + ' folder.');
        }
    });
}

export {
    ensureDirectoryExists
};
