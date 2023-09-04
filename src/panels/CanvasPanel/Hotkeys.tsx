
import { useHotkeys } from '@mantine/hooks';
import { useAppSelector } from '@/hooks';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { InteractionMode, setInteractionMode } from '@/features/canvas';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';


const Root = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0.9;
  bottom: 20;
  right: 20;
`;

const Indicator = styled.div`
  height: 5;
  width: 5;
  position: absolute;
  left: 0;
  border: 3px solid red;
  border-radius: 8;
  margin-top: 8;
  margin-left: -2;
`;

export function Hotkeys() {
  const mode = useAppSelector((s) => s.canvas.interaction);
  const selected = useAppSelector((s) => s.canvas.selectedId);

  const { setMode, removeSelected, isMasked, clearMask, undo } = useCanvasInteractions();
  const dispatch = useDispatch();

  // Global hotkey binds
  useHotkeys([
    ['S', () => setMode(InteractionMode.Pan)],
    ['E', () => setMode(InteractionMode.Mask)],
    ['W', () => setMode(InteractionMode.Label)],
    ['V', () => setMode(InteractionMode.BoxCut)],
    ['mod + E', () => setMode(InteractionMode.Erase)],
    ['mod + Z', () => undo],
    ['X', () => {
      if (mode === InteractionMode.Mask) {
        clearMask();
      } else {
        removeSelected();
      }
    }],
  ]);

  // Hotkey guide
  return (
    <Root>
      A table was here.
      {/* <table>
        <tbody>
          {(selected || isMasked()) &&
          <tr>
            <td>Delete</td>
            <td><Kbd>X</Kbd></td>
          </tr>
          }
          <tr>
            <td>{mode === InteractionMode.Pan && <Indicator />} Pan</td>
            <td><Kbd>S</Kbd></td>
          </tr>
          <tr>
            <td>{mode === InteractionMode.Mask && <Indicator />} Mask</td>
            <td><Kbd>E</Kbd></td>
          </tr>
          <tr>
            <td>{mode === InteractionMode.Label && <Indicator />} Label</td>
            <td><Kbd>W</Kbd></td>
          </tr>
          <tr>
            <td>{mode === InteractionMode.BoxCut && <Indicator />} Box Cut</td>
            <td><Kbd>V</Kbd></td>
          </tr>
          <tr>
            <td>Erase</td>
            <td><Kbd>⌘</Kbd> + <Kbd>E</Kbd></td>
          </tr>
          <tr>
            <td>Save</td>
            <td><Kbd>⌘</Kbd> + <Kbd>S</Kbd></td>
          </tr>
          <tr>
            <td>Prev</td>
            <td><Kbd>A</Kbd></td>
          </tr>
          <tr>
            <td>Next</td>
            <td><Kbd>D</Kbd></td>
          </tr>
        </tbody>
      </table> */}
    </Root>
  )
}
//
