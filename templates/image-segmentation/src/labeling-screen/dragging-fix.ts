// tslint:disable
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
    (window as any).map = mapRef;
    // TODO hack
    mapRef.leafletElement.panTo([10,10])
    mapRef.leafletElement.setZoom(1)
    addListener(mapRef.leafletElement);
  }
};
