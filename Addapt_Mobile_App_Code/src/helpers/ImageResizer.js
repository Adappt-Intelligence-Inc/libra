import {Image} from 'react-native-compressor';

export const ImageResizer = async image => {
  const result = await Image.compress(image, {
    compressionMethod: 'manual',
    quality: 0.7,
  });
  return result;
};
