/**
 * Supported parameters:
 * w: set the new image width in pixels
 * h: set the new image height in pixels
 * fmt: set the new image format
 *  - jpg
 *  - png
 *  - webp
 *  - avif
 *  @note if not specified, will use the `accept` header media type to determine if the image should be converted
 */
export enum IMAGE_API_PARAMS {
  HEIGHT = 'h',
  WIDTH = 'w',
  FORMAT = 'fmt',
  // internal
  SRC_IMAGE = 'sourceImage',
  EXTENSION = 'ext',
}

export enum Format {
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif',
}
