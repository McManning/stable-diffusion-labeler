import React, { MutableRefObject, UIEventHandler, forwardRef, memo, useRef } from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import { ImageThumb } from '../ImageThumb';
import { ImageViewMode } from '@/components/ImageViewModeButtonGroup';
import { ImageDetails } from '../ImageDetails';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';

export interface ImageGridProps {
  images: TrainingImage[]
  width: number
  height: number
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

const THUMBNAIL_SIZE = 160;

// const Cell = memo(({ data, columnIndex, rowIndex, style }: any) =>
//   <div style={style}>
//     <Thumbnail
//       index={columns * rowIndex + columnIndex}
//       width={THUMBNAIL_SIZE}
//       height={THUMBNAIL_SIZE}
//     />
//   </div>
// , areEqual);

function ImageGridImpl({ images, width, height }: ImageGridProps) {
  const ref = useRef<FixedSizeGrid>(null);

  const count = images.length;

  const columns = Math.floor(width / THUMBNAIL_SIZE);
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

  // TODO: Shift+click and ctrl+click instead for multi-selection?

  return (
    <FixedSizeGrid
      ref={ref}
      height={height}
      width={width}
      columnCount={columns}
      columnWidth={THUMBNAIL_SIZE}
      rowCount={rows}
      rowHeight={THUMBNAIL_SIZE}
      innerElementType={innerElementType}
      itemData={images}
    >
      {({ data, columnIndex, rowIndex, style }) => (
        <div style={style}>
          <ImageThumb
            image={data[columns * rowIndex + columnIndex]}
            size={THUMBNAIL_SIZE}
          />
        </div>
      )}
    </FixedSizeGrid>
  );
}

export const ImageGrid = memo(ImageGridImpl);
