import { useState } from "react";
import { useDispatch } from "react-redux";
import { DatasetTab, recoverImages, selectImages, setTab, trashImages } from '@/features/dataset';
import { addImages } from '@/features/queue';
import { useAppSelector } from '@/hooks';

/**
 * Utilities to simplify dataset interactions
 */
export function useDatasetInteractions() {
  const dispatch = useDispatch();
  const selected = useAppSelector((s) => s.dataset.selected);
  const tab = useAppSelector((s) => s.dataset.tab);

  const processed = useAppSelector((s) => s.dataset.processed);
  const unprocessed = useAppSelector((s) => s.workspace.activeWorkspace?.images ?? []);
  const trashed = useAppSelector((s) => s.dataset.trashed);

  let images = unprocessed;
  if (tab === 'Processed') {
    images = processed;
  } else if (tab === 'Trashed') {
    images = trashed;
  }

  const isSelected = (image: TrainingImage) => selected.find((i) => i.id === image.id) !== undefined

  return {
    /** Image set for the current tab */
    images,

    /** Name of the current tab */
    tab,

    /**
     * Change the current tab.
     *
     * This will deselect anything currently selected on the previous tab
     */
    switchTab(newTab: DatasetTab) {
      dispatch(selectImages([]));
      dispatch(setTab(newTab));
    },

    isSelected,

    /** Selected images within the current tab */
    selected,

    select(image: TrainingImage) {
      if (isSelected(image))
        return;

      dispatch(selectImages([...selected, image]));
    },

    deselect(image: TrainingImage) {
      const index = selected.findIndex((i) => i.id === image.id);
      if (index < 0)
        return;

      dispatch(selectImages([
        ...selected.slice(0, index),
        ...selected.slice(index + 1)
      ]));
    },

    selectAll() {
      dispatch(selectImages(images));
    },

    /**
     * Deselect all images
     */
    clearSelection() {
      dispatch(selectImages([]));
    },

    trashSelection() {
      dispatch(trashImages(selected));
      dispatch(selectImages([]));
    },

    recoverSelection() {
      dispatch(recoverImages(selected));
      dispatch(selectImages([]));
    },

    /**
     * Send selected images to the processing queue
     */
    processSelection() {
      dispatch(addImages(selected));
      dispatch(selectImages([]));
      // TODO: Somehow lock the image while in the queue?
    },
  }
}
