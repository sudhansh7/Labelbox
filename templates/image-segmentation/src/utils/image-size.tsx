// tslint:disable
// TODO name this better (mind blanking for what this is called);
function returnSameItemForSameParamaters(func: Function){
  const calls = {};
  return (...args: any[]) => {
    const params = JSON.stringify(args);
    if (!calls[params]) {
      calls[params] = func(...args);
    }
    return calls[params];
  }
}

export const getSizeOnImage = returnSameItemForSameParamaters((url: string) => {
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
});
