import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Group, Item, Text } from '@osuresearch/ui';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { InteractionMode } from '@/features/canvas';
import { closeContextMenu } from '@/features/settings';
import { useDatasetInteractions } from '@/hooks/useDatasetInteractions';
import { useImg2Img } from '@/hooks/useImg2Img';
import { Menu } from './Menu';
import { formatWithOptions } from 'util';
import { deleteImages } from '@/features/workspace';


// function Tools() {
//   const { setMode } = useCanvasInteractions();

//   return (
//     <>
//     <Menu.Label>Tools</Menu.Label>
//     <Menu.Item onClick={() => setMode(InteractionMode.Pan)} py={5}>
//       <Group position="apart">
//         Pan <Kbd>S</Kbd>
//       </Group>
//     </Menu.Item>

//     <Menu.Item onClick={() => setMode(InteractionMode.Mask)} py={5}>
//       <Group position="apart">
//         Mask <Kbd>E</Kbd>
//       </Group>
//     </Menu.Item>

//     <Menu.Item onClick={() => setMode(InteractionMode.Label)} py={5}>
//       <Group position="apart">
//         Label <Kbd>W</Kbd>
//       </Group>
//     </Menu.Item>

//     <Menu.Item onClick={() => setMode(InteractionMode.BoxCut)} py={5}>
//       <Group position="apart">
//         Box Cut <Kbd>V</Kbd>
//       </Group>
//     </Menu.Item>
//     </>
//   );
// }

// function Masking() {
//   const { setMode, clearMask } = useCanvasInteractions();
//   const { apply } = useImg2Img();

//   return (
//     <>
//     <Menu.Label>Masking</Menu.Label>
//     <Menu.Item onClick={apply}>Img2img</Menu.Item>
//     <Menu.Item onClick={() => 0}>Custom Img2img</Menu.Item>
//     <Menu.Item onClick={clearMask}>Clear</Menu.Item>
//     </>
//   );
// }

// function Labeling({ selected }: { selected: Label }) {
//   const { removeSelected, edit } = useCanvasInteractions();

//   let title = 'Label #' + selected.id;
//   if (selected.isBoxCut) {
//     title = 'Box Cut';
//   }

//   return (
//     <>
//     <Menu.Label>{title}</Menu.Label>

//     {selected.isBoxCut &&
//       <Menu.Item onClick={() => 0}>Apply</Menu.Item>
//     }
//     {!selected.isBoxCut &&
//       <Menu.Item onClick={() => edit(selected)}>Edit</Menu.Item>
//     }

//     <Menu.Item onClick={removeSelected}>Remove</Menu.Item>
//     {/* <Menu.Item onClick={() => setMode(InteractionMode.Pan)}>Img2img</Menu.Item>
//     <Menu.Item onClick={() => setMode(InteractionMode.Mask)}>Custom Img2img</Menu.Item>
//     <Menu.Item onClick={clearMask}>Clear</Menu.Item> */}
//     </>
//   );
// }

// function CanvasMenu() {
//   const { isMasked, getSelected } = useCanvasInteractions();

//   const selected = getSelected();

//   return (
//     <>
//       {isMasked() && !selected && <Masking />}
//       {selected && <Labeling selected={selected} />}
//       {!selected && <Tools />}
//     </>
//   )
// }

// function DatasetMenu() {
//   const {
//     tab,
//     selected,
//     trashSelection,
//     processSelection,
//     recoverSelection
//   } = useDatasetInteractions();

//   return (
//   <>
//     <Menu.Label>Dataset</Menu.Label>
//     {selected.length > 0 && tab !== 'Trashed' &&
//       <Menu.Item onClick={processSelection}>Process {selected.length} images</Menu.Item>
//     }

//     {selected.length > 0 && tab !== 'Trashed' &&
//       <Menu.Item onClick={trashSelection}>Trash {selected.length} images</Menu.Item>
//     }

//     {selected.length > 0 && tab === 'Trashed' &&
//       <Menu.Item onClick={recoverSelection}>Recover {selected.length} images</Menu.Item>
//     }
//   </>
//   )
// }

/**
 * Global context menu for interaction with different components
 */
export function ContextMenu() {
  const ctx = useAppSelector((s) => s.settings.contextMenu);
  const canvasImage = useAppSelector((s) => s.canvas.current);

  const selectedImage = ctx?.context === 'image' && ctx?.data
    ? ctx.data as TrainingImage
    : canvasImage;

  const dispatch = useDispatch();

  // We very intentionally disable browser context menus
  // to implement our own.
  useEffect(() => {
    const close = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', close);

    return () => document.removeEventListener('contextmenu', close);
  }, []);

  const onReveal = () => {
    alert('reveal')
  }

  const onDelete = () => {
    if (selectedImage) {
      dispatch(deleteImages([selectedImage]));
    }

    dispatch(closeContextMenu())
  }

  return (
    <Menu
      open={ctx !== undefined}
      onClose={() => dispatch(closeContextMenu())}
      target={
        <div style={{
          position: 'fixed',
          top: ctx?.position.y,
          left: ctx?.position.x
        }}
        />
      }
      items={[
        { key: 'reveal', label: 'Reveal in File Explorer', accelerator: 'Shift+Alt+R', onClick: onReveal },
        { key: 'delete', label: 'Delete', accelerator: 'Delete', onClick: onDelete },
      ]}
    >
      {(item) => <Item key={item.key} textValue={item.label}>
        <Group justify="apart" align="stretch" w="100%" fs="sm">
          {item.label}
          <Text c="neutral-subtle">{item.accelerator}</Text>
        </Group>
      </Item>}
    </Menu>
  );
}

