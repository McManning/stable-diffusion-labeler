import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { memo } from "react";
import { FixedSizeList, areEqual } from "react-window";
import { ImageDetails } from "../ImageDetails";

export interface ImageListProps {
  images: TrainingImage[]
  width: number
  height: number

  /**
   * Should images in the list display tag matches
   * against current search/replace filters
   */
  isFiltered?: boolean
}

const ROW_HEIGHT = 64;

// TODO: Perf check to see if I need to memoize row states.
// const Row = memo(({ data, index, style }: any) =>
//   <div style={style}>
//     <ImageDetails image={data[index]} height={ROW_HEIGHT} />
//   </div>
// , areEqual);

export function ImageList({ images, width, height, isFiltered }: ImageListProps) {
  return (
    <FixedSizeList
      width={width}
      height={height}
      itemCount={images.length}
      itemData={images}
      itemSize={ROW_HEIGHT}
      style={{ overflowX: 'hidden' }}
    >
      {({ data, index, style }) =>
        <div style={style}>
          <ImageDetails image={data[index]} height={ROW_HEIGHT} isFiltered={isFiltered} />
        </div>
      }
    </FixedSizeList>
  )
}
