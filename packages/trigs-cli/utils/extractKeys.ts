import fs from 'node:fs';

// Function to safely evaluate code and extract keys
export function extractKeysFromJSFile(filePath: string) {
  return new Promise((resolve, reject) => {
    // Read the file contents
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      const extractFn = new Function(data + '; return Object.keys(exportedObject);');

      try {
        const keys = extractFn();
        return resolve(keys)
      } catch (e) {
        return reject(e);
      }
    });
  });
}
