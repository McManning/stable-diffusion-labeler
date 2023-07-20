import { Button } from "@mui/material";
import { useDoodleStage } from "@/hooks/useDoodleStage";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { ClearCommand } from "@/utils/commands";

export function ClearDoodleButton() {
  const { getLayerById } = useDoodleStage();
  const { push } = useCommandHistory();

  const onClick = () => {
    push(new ClearCommand(getLayerById('draw')));
  }

  return (
    <Button onClick={onClick}>Clear</Button>
  )
}
