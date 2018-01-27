export function getSizeOnImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = (event) => {
      document.body.removeChild(img);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = (event) => {
      reject('Error loading image');
    };
    img.style.display = 'none';
    document.body.appendChild(img);
  });
}
