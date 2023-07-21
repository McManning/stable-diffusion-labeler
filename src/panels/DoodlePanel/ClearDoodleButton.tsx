import { Button } from "@mui/material";
import { useDoodleStage } from "@/hooks/useDoodleStage";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { ClearCommand } from "@/utils/commands";

export function ClearDoodleButton() {
  const { getKonvaLayerById } = useDoodleStage();
  const { push } = useCommandHistory();

  const onClick = () => {
    push(new ClearCommand(getKonvaLayerById('draw')));
  }

  return (
    <Button variant="outlined" onClick={onClick}>Clear</Button>
  )
}
