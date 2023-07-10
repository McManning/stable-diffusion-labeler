/* eslint import/prefer-default-export: off */
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function isSupportedImage(file: fs.Dirent) {
  const ext = path.extname(file.name).toLowerCase();
  return !file.isDirectory() && ['.jpg', '.jpeg', '.png', '.gif'].indexOf(ext) >= 0;
}

export function addFolderImagesToWorkspace(filePath: string, workspace: Workspace): Workspace {
  const images: TrainingImage[] = fs.readdirSync(filePath, { withFileTypes: true })
    .filter((file) => isSupportedImage(file))
    .map((file) => {
      const { name } = path.parse(file.name);

      const imagePath = path.join(filePath, file.name);
      const tagsPath = path.join(filePath, `${name}.txt`);
      let tags: string[] = [];

      if (fs.existsSync(tagsPath)) {
        const data = fs.readFileSync(tagsPath, { encoding: 'utf8' });
        tags = data.split(',').map((tag) => tag.trim());
      }

      return {
        id: file.name,
        name: imagePath,
        tags,
      }
    });

  // Merge in the new folder and all images
  return {
    ...workspace,
    folders: [
      ...(workspace.folders ?? []),
      {
        path: filePath,
      }
    ],
    images: [
      ...(workspace.images ?? []),
      ...images,
    ]
  };
}

export function writeWorkspaceToDisk(filePath: string, workspace: Workspace) {
  fs.writeFileSync(filePath, JSON.stringify({
    id: workspace.id,
    name: workspace.name,
    folders: workspace.folders,
    // We don't save the image list. This is generated automatically from folders.
  }));
}

export function writeTagsToDisk(image: TrainingImage) {
  console.log('WRITE TAGS', image);

  const ext = path.extname(image.name);
  const filePath = image.name.substring(0, image.name.length - ext.length);

  fs.writeFileSync(`${filePath}.txt`, image.tags.join(', '));
}

export function readWorkspaceFromDisk(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf8');

  try {
    let workspace = JSON.parse(data) as Workspace;
    workspace.path = filePath;

    // Load image lists from each tracked folder
    workspace.folders.forEach((folder) => {
      workspace = addFolderImagesToWorkspace(folder.path, workspace);
    })

    return workspace;
  }
  catch (e) {
    console.error('Could not parse workspace file', e);
    return undefined;
  }
}

export function deleteImage(image: TrainingImage) {
  console.log('DELETE IMAGE', image);

  const ext = path.extname(image.name);
  const filePath = image.name.substring(0, image.name.length - ext.length);

  const trashDir = path.dirname(filePath) + '/.trashed/';

  const trashPath = trashDir + path.basename(filePath);

  console.log(trashPath);
  console.log(`${filePath}${ext}`);
  console.log(`${filePath}.txt`);

  if (!fs.existsSync(trashDir)) {
    fs.mkdirSync(trashDir);
  }

  if (fs.existsSync(`${filePath}${ext}`)) {
    fs.renameSync(`${filePath}${ext}`, `${trashPath}${ext}`);
  }

  if (fs.existsSync(`${filePath}.txt`)) {
    fs.renameSync(`${filePath}.txt`, `${trashPath}.txt`);
  }
}
