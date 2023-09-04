import { useDispatch } from 'react-redux';
import { useAppSelector } from '.';
import { arraysEqual } from '@/utils';
import { updateImages } from '@/features/workspace';

export function useActiveImage() {
  const activeImage = useAppSelector((s) => s.workspace.activeImage);
  const dispatch = useDispatch();

  return {
    image: activeImage,
    setTags: (tags: string[]) => {
      const cleaned = tags.map((t) => t.trim()).filter((t) => t.length);

      if (!activeImage || arraysEqual(cleaned, activeImage.tags)) {
        return;
      }

      const updated: TrainingImage = {
        ...activeImage,
        tags: cleaned,
      };

      console.log('save', updated);
      dispatch(updateImages([updated]));
    },
  };
}
