import React, { MutableRefObject, UIEventHandler, forwardRef, useRef } from 'react';
import { Alert } from '@osuresearch/ui';
import { FixedSizeGrid } from 'react-window';
import { Thumbnail } from './Thumbnail';
import { DragSelectProvider } from '@/hooks/useDragSelect';

type Props = {
  count: number
  width: number
  height: number
  thumbnailSize: number
}

// className="overflow-y-hidden"
// Container for a <div style="height: 48000px; width: 400px;"... child.
// That contains children elements.
const outerElementType = forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children, ...props }, ref) => (
  <div data-foo="foobar" ref={ref} {...props}>
    hello!
    {children}
  </div>
));

const innerElementType = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div id="image-grid" ref={ref} {...props} />
));

export function ImageGrid({ count, width, height, thumbnailSize }: Props) {
  const ref = useRef<FixedSizeGrid>(null);

  const columns = Math.floor(width / thumbnailSize);
  const rows = count / columns;

  if (count < 1 || width < 1 || height < 1) {
    return null;
  }

  const handleScroll: UIEventHandler = ({ target }) => {
    if (!target) {
      return;
    }

    const { scrollTop } = target as any;
    ref.current?.scrollTo({ scrollTop });
  }

  // TODO: Drag select won't be easy to integrate with a windowing image list.
  // 1. It doesn't scroll the window when dragging the select box.
  // 2. It needs some custom logic to add images to selection when we're scrolling FAST and they don't load

  return (
    // <DragSelectProvider settings={{
    //   draggability: false,
    //   area: document.getElementById('image-grid') ?? undefined, // container.current ?? undefined,
    //   selectedClass: 'bg-primary',
    // }}>
      <FixedSizeGrid
        ref={ref}
        height={height}
        width={width}
        columnCount={columns}
        columnWidth={thumbnailSize}
        rowCount={rows}
        rowHeight={thumbnailSize}
        innerElementType={innerElementType}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div style={style}>
            <Thumbnail
              index={columns * rowIndex + columnIndex}
              width={thumbnailSize}
              height={thumbnailSize}
            />
          </div>
        )}
      </FixedSizeGrid>
    // </DragSelectProvider>
  );
}
