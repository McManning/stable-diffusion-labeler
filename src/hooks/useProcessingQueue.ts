import { useAppSelector } from "."

/**
 * Hook to interact with the queue of images pending processing
 */
export function useProcessingQueue() {
  const queue = useAppSelector((s) => s.queue.images);

  return {
    queue,

    isQueued(image: TrainingImage) {
      return queue.findIndex((img) => img.id === image.id) >= 0;
    }
  }
}
