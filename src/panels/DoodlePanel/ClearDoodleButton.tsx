import { Button } from "@mui/material";
import { useDoodleStage } from "@/hooks/useDoodleStage";

export function ClearDoodleButton() {
  const { clearDrawLayer } = useDoodleStage();

  const onClick = () => {
    clearDrawLayer();
  }

  return (
    <Button onClick={onClick}>Clear</Button>
  )
}
