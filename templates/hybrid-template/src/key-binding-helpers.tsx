import { Observable } from 'rxjs';

const keyMap = {
  space: 32,
  cmd: 91,
  escape: 27,
  a: 65,
  e: 69,
  f: 70,
  s: 83,
  z: 90,
  ctrl: 17,
  del: 46,
  backspace: 8,
  enter: 13,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
};

type mappedKeys = 'space' |
  'cmd' |
  'ctrl' |
  'escape' |
  'a' |
  'f' |
  'z' |
  'del' |
  'backspace' |
  'enter'|
  's' |
  'e' |
  '1' |
  '2' |
  '3' |
  '4' |
  '5' |
  '6' |
  '7' |
  '8' |
  '9' |
  '0';

const keyEvent = (keyCode: number, event: string) => Observable.fromEvent(document, event)
  .filter((e: KeyboardEvent) => e.keyCode === keyCode)
  .do((e: KeyboardEvent) => e.preventDefault());

const keyDown = (keyCode: number) => keyEvent(keyCode, 'keydown');
const keyUp = (keyCode: number) => keyEvent(keyCode, 'keyup');

export function keyDownSteam(key: mappedKeys) {
  return keyDown(keyMap[key]).map(() => key);
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
