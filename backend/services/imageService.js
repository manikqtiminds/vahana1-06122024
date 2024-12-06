const s3 = require('../config/aws');
const sizeOf = require('image-size');

class ImageService {
  async getImagesWithDamageInfo(referenceNo) {
    const imageData = await this.fetchImageFiles(referenceNo);
    if (!imageData.Contents || imageData.Contents.length === 0) {
      throw new Error('No images found for this reference number');
    }

    const coordinateFiles = await this.fetchCoordinateFiles(referenceNo);
    const imagesWithDamageInfo = await this.processImages(referenceNo, imageData, coordinateFiles);
    
    return imagesWithDamageInfo;
  }

  async fetchImageFiles(referenceNo) {
    const imageParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `AIInspection/${referenceNo}/images/`,
    };
    return await s3.listObjectsV2(imageParams).promise();
  }

  async fetchCoordinateFiles(referenceNo) {
    const coordinateParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `AIInspection/${referenceNo}/coordinates/`,
    };
    
    const coordinateData = await s3.listObjectsV2(coordinateParams).promise();
    const coordinateFiles = {};

    for (const coord of coordinateData.Contents) {
      const key = coord.Key;
      const fileName = key.split('/').pop().replace('.txt', '');
      try {
        const fileContent = await s3.getObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key
        }).promise();
        coordinateFiles[fileName] = this.parseDamageReport(fileContent.Body.toString('utf-8'));
      } catch (error) {
        console.warn(`Error reading coordinates for file: ${key}`);
        coordinateFiles[fileName] = [];
      }
    }

    return coordinateFiles;
  }

  async processImages(referenceNo, imageData, coordinateFiles) {
    const imagePromises = imageData.Contents
      .filter(item => this.isImageFile(item.Key))
      .map(async (item) => {
        const imageKey = item.Key;
        const imageName = imageKey.split('/').pop().replace(/\.[^/.]+$/, '');

        const url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: imageKey,
          Expires: 3600,
        });

        const imageObject = await s3.getObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: imageKey
        }).promise();

        if (!imageObject.Body) {
          return null;
        }

        const dimensions = sizeOf(imageObject.Body);

        return {
          referenceNo,
          imageName: imageKey.split('/').pop(),
          imageUrl: url,
          dimensions: {
            width: dimensions.width,
            height: dimensions.height,
          },
          damageInfo: coordinateFiles[imageName] || [],
        };
      });

    const processedImages = await Promise.all(imagePromises);
    return processedImages.filter(img => img !== null);
  }

  isImageFile(key) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    return !key.endsWith('/') && imageExtensions.some(ext => key.toLowerCase().endsWith(ext));
  }

  parseDamageReport(txtContent) {
    const lines = txtContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return lines
      .map(line => {
        try {
          const [damageType, coords] = line.split(' ');
          if (!damageType || !coords) {
            throw new Error('Invalid line format');
          }

          const [x, y, x2, y2] = coords.split(',').map(Number);

          if ([damageType, x, y, x2, y2].some(value => isNaN(value))) {
            return null;
          }

          return {
            damageType: parseInt(damageType, 10),
            coordinates: {
              x,
              y,
              width: x2 - x,
              height: y2 - y,
            },
          };
        } catch (error) {
          console.error(`Error parsing line: "${line}"`, error);
          return null;
        }
      })
      .filter(entry => entry !== null);
  }
}

module.exports = new ImageService();