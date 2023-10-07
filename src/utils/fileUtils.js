export const loadFileHtml = (file, mediaType) =>
  new Promise((resolve, reject) => {
    try {
      let fileHtml = document.createElement(mediaType);
      fileHtml.preload = 'metadata';

      fileHtml.onloadedmetadata = function () {
        resolve(this);
      };

      fileHtml.onerror = function () {
        reject('Invalid file. Please select a valid file.');
      };
      if (window.URL) fileHtml.src = window.URL.createObjectURL(file);
    } catch (e) {
      reject(e);
    }
  });
