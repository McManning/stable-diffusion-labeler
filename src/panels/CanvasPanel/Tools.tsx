import Konva from 'konva';
import { useDispatch } from 'react-redux';
import { useAppSelector } from "@/hooks";
import { setBrightness, setLabels } from "@/features/canvas";
import { newId } from "./util";
import { Group } from 'react-konva';

export function Tools() {
  const dispatch = useDispatch();
  const labels = useAppSelector((s) => s.canvas.labels);
  const brightness = useAppSelector((s) => s.canvas.brightness);

  const addLabel = () => {
    // const point = getRelativePointerPosition(
    //   e.target.getStage() as Konva.Stage
    // );

    const label = {
      id: newId(),
      color: Konva.Util.getRandomColor(),
      x: 300,
      y: 300,
      w: 200,
      h: 200,
    };

    dispatch(setLabels([...labels, label]));
  }

  return (
    <Group>
      TODO: Brightness slider
      {/* <Slider
        label="Brightness"
        min={-1.0}
        max={1.0}
        step={0.05}
        w={200}
        value={brightness}
        onChange={(f) => dispatch(setBrightness(f))}
      /> */}

      {/* <Button size="xs" aria-label="Zoom in">+</Button>
      <Button size="xs" aria-label="Zoom out">-</Button> */}

      {/* <Button onClick={addLabel}>Add Label</Button> */}
    </Group>
  )
}
