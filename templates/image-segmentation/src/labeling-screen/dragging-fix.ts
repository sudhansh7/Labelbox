const once = (func: Function) => {
  let calls = 0;
  // tslint:disable-next-line
  return (...args: any[]) => {
    if (calls === 0) {
      calls += 1;
      func(...args);
    }
  };
};

// tslint:disable-next-line
const addListener = once((leafletMap: any) => {
  leafletMap.on('dragstart', () => {
    const removePoint: HTMLElement | null = document.querySelector('a[title="Delete last point drawn"]');
    if (removePoint !== null) {
      removePoint.click();
    }
  });
});

// tslint:disable-next-line
export const improveDragging = (mapRef: any) => {
  if (mapRef && mapRef.leafletElement) {
    addListener(mapRef.leafletElement);
  }
};
