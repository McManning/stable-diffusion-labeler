import { useCommandHistory } from "@/hooks/useCommandHistory";
import { Box, Button, Stack } from "@mui/material";

/**
 * Quick debugger to show command history
 */
export function HistoryDebug() {
  const { undoStack, redoStack, redo, undo } = useCommandHistory();

  return (
    <Box position="absolute" top={8} left={120} bgcolor="Background">
      <Button onClick={() => undo()}>Undo</Button>
      <Button onClick={() => redo()}>Redo</Button>

      <Stack direction="row" maxHeight={200} overflow="scroll">
        <Stack>
          <strong>Undo Stack</strong>

          {[...undoStack].reverse().map((cmd, i) => (
            <div key={i}>
              {i}: {cmd.toString()}
            </div>
          ))}
        </Stack>
        <Stack>
          <strong>Redo Stack</strong>

          {[...redoStack].reverse().map((cmd, i) => (
            <div key={i}>
              {i}: {cmd.toString()}
            </div>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
