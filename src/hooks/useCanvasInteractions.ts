import { useAppSelector } from ".";
import {
  editLabel,
  InteractionMode,
  setImage,
  setInteractionMode,
  setLabels,
  setRegions
} from "@/features/canvas";
import { useDispatch } from "react-redux";

/**
 * Utilities to simplify canvas interaction from anywhere (e.g. hotkeys)
 */
export function useCanvasInteractions() {
  const mode = useAppSelector((s) => s.canvas.interaction);
  const selected = useAppSelector((s) => s.canvas.selectedId);
  const labels = useAppSelector((s) => s.canvas.labels);
  const regions = useAppSelector((s) => s.canvas.regions);
  const dispatch = useDispatch();

  const removeLabel = (id: number) => {
    const index = labels.findIndex((x) => x.id === id);
    if (index < 0) {
      return;
    }

    dispatch(setLabels([
      ...labels.slice(0, index),
      ...labels.slice(index + 1)
    ]));
  }

  return {
    removeLabel,

    setImage(image?: TrainingImage) {
      dispatch(setImage(image));
    },

    getSelected() {
      const index = labels.findIndex((x) => x.id === selected);
      if (index >= 0) {
        return labels[index];
      }
    },

    /**
     * Select the given label and open the editor dialog
     */
    edit(label: Label) {
      dispatch(editLabel(label));
    },

    /**
     * Replace a label with the matching ID with the new instance
     */
    replaceLabel(label: Label) {
      const index = labels.findIndex((x) => x.id === label.id);
      if (index < 0) {
        return;
      }

      // Splice and inject
      dispatch(setLabels([
        ...labels.slice(0, index),
        label,
        ...labels.slice(index + 1)
      ]));
    },

    isMasked() {
      return regions.length > 0;
    },

    removeSelected() {
      if (selected) {
        removeLabel(selected);
      }
    },

    clearMask() {
      dispatch(setRegions([]));
    },

    setMode(newMode: InteractionMode) {
      dispatch(setInteractionMode(newMode));
    },

    /**
     * Undo last operation
     */
    undo() {

    },
  }
}
