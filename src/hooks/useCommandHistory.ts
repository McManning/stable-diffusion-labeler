import { createContext, useContext, useState } from "react";
import { ICommand } from "@/utils/commands";

interface ICommandHistory {
  undoStack: ICommand[]
  redoStack: ICommand[]

  redo: (levels?: number) => void
  undo: (levels?: number) => void
  push: (cmd: ICommand) => void
}

export const Context = createContext<ICommandHistory>({} as ICommandHistory);

export function useCommandHistoryProvider(): ICommandHistory {
  const [undoStack, setUndoStack] = useState<ICommand[]>([]);
  const [redoStack, setRedoStack] = useState<ICommand[]>([]);

  return {
    undoStack,
    redoStack,

    redo(levels: number = 1) {
      for (let i = 1; i <= levels; i++) {
        if (redoStack.length > 0) {
          const command = redoStack.pop() as ICommand;
          command.execute();

          setRedoStack([...redoStack]);
          setUndoStack([...undoStack, command]);
        }
      }
    },

    undo(levels: number = 1) {
      for (let i = 1; i <= levels; i++) {
        if (undoStack.length > 0) {
          const command = undoStack.pop() as ICommand;
          command.undo();

          setUndoStack([...undoStack]);
          setRedoStack([...redoStack, command]);
        }
      }
    },

    push(command: ICommand) {
      command.execute();
      setUndoStack([...undoStack, command]);

      if (redoStack.length > 0) {
        redoStack.forEach((cmd) => cmd.release());
        setRedoStack([]);
      }
    }
  };
}

export function useCommandHistory() {
  const ctx = useContext(Context);
  return ctx;
}
