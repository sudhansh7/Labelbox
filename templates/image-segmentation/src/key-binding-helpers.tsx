import { Observable } from 'rxjs';

const keyMap = {
  space: 32,
  cmd: 91,
  escape: 27,
  z: 90,
  ctrl: 17,
  del: 127,
};

type mappedKeys = 'space' | 'cmd' | 'ctrl' | 'escape' | 'z' | 'del';
const keyEvent = (keyCode: number, event: string) => Observable.fromEvent(document, event)
  .filter((e: KeyboardEvent) => e.keyCode === keyCode);

const keyDown = (keyCode: number) => keyEvent(keyCode, 'keydown');
const keyUp = (keyCode: number) => keyEvent(keyCode, 'keyup');

export function keyDownSteam(key: mappedKeys) {
  return keyDown(keyMap[key]);
}

export function keyComboStream(modifierKey: mappedKeys | mappedKeys[], withKey: mappedKeys) {
  const keyCombo = (modifierKeyCode: number, withKeyCode: number) =>
    keyDown(modifierKeyCode).flatMap(() => {
      return keyDown(withKeyCode).takeUntil(keyUp(modifierKeyCode));
    });

  return Array.isArray(modifierKey) ?
    Observable.merge(...modifierKey.map((modifier) => keyCombo(keyMap[modifier], keyMap[withKey]))) :
    keyCombo(keyMap[modifierKey], keyMap[withKey]);
}
