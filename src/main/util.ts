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
  return (
    !file.isDirectory() &&
    ['.jpg', '.jpeg', '.png', '.gif', '.webp'].indexOf(ext) >= 0
  );
}

export function addFolderImagesToWorkspace(
  filePath: string,
  workspace: Workspace
): Workspace {
  const images: TrainingImage[] = fs
    .readdirSync(filePath, { withFileTypes: true })
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
      };
    });

  // TODO: Duplicate management here. We run into issues where folder paths
  // are duplicated multiple times.

  // Merge in the new folder and all images
  return {
    ...workspace,
    folders: [
      ...(workspace.folders ?? []),
      {
        path: filePath,
      },
    ],
    images: [...(workspace.images ?? []), ...images],
  };
}

export function addImagesToWorkspace(
  workspace: Workspace,
  images: TrainingImage[],
  insertAfter?: TrainingImage
): Workspace {
  // TODO: This should inject into workspace images but that list isn't persisted on save.
  // We're currently just relying on the fact that workspace images are in each folder directly.

  if (workspace.path) {
    writeWorkspaceToDisk(workspace.path, workspace);
  }

  return workspace;
}

export function writeWorkspaceToDisk(filePath: string, workspace: Workspace) {
  fs.writeFileSync(
    filePath,
    JSON.stringify({
      id: workspace.id,
      name: workspace.name,
      folders: workspace.folders,
      // We don't save the image list. This is generated automatically from folders.
    })
  );
}

export function writeTagsToDisk(image: TrainingImage) {
  console.log('WRITE TAGS', image);

  const ext = path.extname(image.name);
  const filePath = image.name.substring(0, image.name.length - ext.length);

  fs.writeFileSync(`${filePath}.txt`, image.tags.join(', '));
}

/**
 * @param image source image that is cropped
 * @param crop metadata about the crop
 */
export function writeImageCropToDisk(
  image: TrainingImage,
  crop: Crop
): TrainingImage {
  debugger;
  const ext = path.extname(image.name);
  const filePath = image.name.substring(0, image.name.length - ext.length);

  if (!crop.dataUri) {
    throw new Error(`No data uri for crop ${filePath}`);
  }

  const name = `${filePath}-${crop.x}p${crop.y}-${crop.width}x${crop.height}.png`;

  const buffer = Buffer.from(crop.dataUri.split(',')[1], 'base64');

  fs.writeFileSync(name, buffer);

  return {
    id: name,
    name: name,
    tags: [],
  };
}

export function readWorkspaceFromDisk(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf8');

  try {
    let workspace = JSON.parse(data) as Workspace;
    workspace.path = filePath;

    // Load image lists from each tracked folder
    workspace.folders.forEach((folder) => {
      workspace = addFolderImagesToWorkspace(folder.path, workspace);
    });

    return workspace;
  } catch (e) {
    console.error('Could not parse workspace file', e);
    return undefined;
  }
}

/**
 * Rescan workspace directories and files for changes
 * and create an updated workspace definition
 *
 * @param workspace
 */
export function reloadWorkspace(workspace: Workspace): Workspace {
  if (!workspace.path) {
    return { ...workspace };
  }

  const reloaded = readWorkspaceFromDisk(workspace.path);
  if (!reloaded) {
    throw new Error('Error while reloading workspace');
  }

  return reloaded;
}

export function deleteImage(image: TrainingImage) {
  console.log('DELETE IMAGE', image);

  const ext = path.extname(image.name);
  const filePath = image.name.substring(0, image.name.length - ext.length);

  const trashDir = `${path.dirname(filePath)}/.trashed/`;

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

/**
 * Replace tags in a batch of images
 *
 * @param replacements
 */
export function replaceTags(
  workspace: Workspace,
  replacements: ImageSearchResult[]
) {
  console.log('REPLACE TAGS', replacements);

  replacements.forEach((res) => {
    const src = workspace.images.find((img) => img.id === res.image.id);
    if (!src) {
      throw new Error('Image missing in current workspace, cannot apply op');
    }

    src.tags = res.image.tags.map((tag) => {
      const match = res.tags.find((t) => t.match === tag);
      if (match) {
        return match.replace ?? match.match;
      }

      return tag;
    });

    writeTagsToDisk(src);
  });
}

/**
 * Crop a source image into multiple images and return the new crops
 *
 * @param image
 * @param crops
 */
export function cropImage(
  image: TrainingImage,
  crops: Crop[]
): TrainingImage[] {
  // do work, return workspace with updates.
  // Load image data
}
