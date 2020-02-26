const Jimp = require('jimp');
const fs = require('fs');

const rootpath = "public/uploads/product";

const resizeImages = async (imageFiles, width, height = Jimp.AUTO, quality = null, pathWrite = null) => {
  await Promise.all(
    imageFiles.map(async file => {
      let {filename, destination, path} = file;
      const image = await Jimp.read(path);

      await image.resize(width, height);
      await image.quality(quality);
      await image.writeAsync(`${destination}/${pathWrite}/${filename}`);
    })
  );
}

const removeImages = async (imageFiles) => {
  await Promise.all(
    imageFiles.map(async file => {
      let {filename, destination, path} = file;
      await fs.unlink(path, (error) => {
        if(error) return false;
        return true;
      });
    })
  );
}

module.exports = { resizeImages, removeImages };