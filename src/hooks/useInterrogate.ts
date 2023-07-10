import { useMemo, useState } from "react";
import { useCanvasInteractions } from "./useCanvasInteractions";

export function useInterrogate() {
  const { replaceLabel } = useCanvasInteractions();
  const [loading, setLoading] = useState(false);

  return useMemo((() => ({
    loading,
    interrogate(label: Label) {
      setLoading(true);

      return new Promise<string>((resolve, reject) => {

        // Mock for now
        window.setTimeout(() => {
          setLoading(false);
          resolve('TODO!');

        }, 1000);

        // TODO: Clip out the labeled part of the image,
        // send to interrogator API. Wait. Return.
      });
    },
  })), [loading]);
}
