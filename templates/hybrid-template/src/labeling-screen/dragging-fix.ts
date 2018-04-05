const once = (func: Function) => {
  let calls = 0;
  return (...args: any[]) => {
    if (calls === 0) {
      calls += 1;
      func(...args);
    }
  };
};

const addListener = once((leafletMap: any) => {
  leafletMap.on('dragstart', () => {
    const removePoint: HTMLElement | null = document.querySelector('a[title="Delete last point drawn"]');
    if (removePoint !== null) {
      removePoint.click();
    }
  });
});

export const improveDragging = (mapRef: any) => {
  if (mapRef && mapRef.leafletElement) {
    addListener(mapRef.leafletElement);
  }
};
