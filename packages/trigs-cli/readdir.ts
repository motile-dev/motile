// Define the type for a folder with children
import * as fs from "fs";
import * as path from "path";

interface Folder {
  name: string;
  children: Folder[];
}

// The synchronous function that returns the folder structure
export const getFolderNamesRecursiveSync = (dirPath: string): Folder => {
  const dirents = fs.readdirSync(dirPath, { withFileTypes: true });
  const folders: Folder[] = dirents
    .filter((dirent) => dirent.isDirectory()) // Filter for directories only
    .map((dirent) => {
      const fullPath = path.join(dirPath, dirent.name);
      return getFolderNamesRecursiveSync(fullPath); // Recursive call for each directory
    });

  return {
    name: path.basename(dirPath),
    children: folders,
  };
};
