import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks";
import { useCanvasInteractions } from "@/hooks/useCanvasInteractions";
import { useInterrogate } from "@/hooks/useInterrogate";
import { editLabel } from "@/features/canvas";

export function LabelEditorDialog() {
  const label = useAppSelector((s) => s.canvas.editLabel);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const { replaceLabel } = useCanvasInteractions();
  const { interrogate, loading } = useInterrogate();

  useEffect(() => {
    setText(label?.text ?? '');
  }, [label]);

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!label) return;

    replaceLabel({
      ...label,
      text
    });

    dispatch(editLabel());
  }

  const onInterrogate = async () => {
    if (!label) return;

    const result = await interrogate(label);
    setText(result);
  }

  return (
    <div>
      TBD
    </div>
  )

  // return (
  //   <Modal
  //     centered
  //     opened={label !== undefined}
  //     onClose={() => dispatch(editLabel())}
  //     title={`Edit Label #${label?.id}`}
  //   >
  //     <form noValidate onSubmit={onSubmit}>
  //       <Textarea
  //         name="Label text"
  //         label="Label text"
  //         value={text}
  //         disabled={loading}
  //         onChange={(e) => setText(e.target.value)}
  //         withAsterisk
  //         data-autofocus
  //       />
  //       <Group mt="sm" position="apart">
  //         <Button
  //           variant="outline"
  //           disabled={loading}
  //           onClick={onInterrogate}
  //         >
  //           {loading && <Loader size="xs" mr="xs" />} Interrogate
  //         </Button>
  //         <Button type="submit" disabled={loading}>Save</Button>
  //       </Group>
  //     </form>
  //   </Modal>
  // );
}
