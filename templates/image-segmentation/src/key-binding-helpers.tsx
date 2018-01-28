import { Observable } from 'rxjs';

type mappedKeys = 'space' | 'cmd' | 'ctrl' | 'z';

export function keyComboStream(modifierKey: mappedKeys | mappedKeys[], withKey: mappedKeys) {
  const keyMap = {
    space: 32,
    cmd: 91,
    ctrl: 27,
    z: 90,
  };

  const keyEvent = (keyCode: number, event: string) => Observable.fromEvent(document, event)
    .filter((e: KeyboardEvent) => e.keyCode === keyCode);

  const keyDown = (keyCode: number) => keyEvent(keyCode, 'keydown');
  const keyUp = (keyCode: number) => keyEvent(keyCode, 'keyup');

  const keyCombo = (modifierKeyCode: number, withKeyCode: number) =>
    keyDown(modifierKeyCode).flatMap(() => {
      return keyDown(withKeyCode).takeUntil(keyUp(modifierKeyCode));
    });

  return Array.isArray(modifierKey) ?
    Observable.merge(...modifierKey.map((modifier) => keyCombo(keyMap[modifier], keyMap[withKey]))) :
    keyCombo(keyMap[modifierKey], keyMap[withKey]);
}
