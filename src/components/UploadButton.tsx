import { Button, ButtonProps, mergeRefs } from "@osuresearch/ui"
import { ChangeEvent, forwardRef, useRef } from "react";

export type UploadButtonProps = ButtonProps & {

  /**
   * Change event for when the user has uploaded new files
   */
  onFiles: (files: File[]) => void;

  multiple?: boolean;

  /** Input name */
  name?: string

  /**
   * Comma-delimited list of mime types to accept.
   *
   * For more information, see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   */
  accept: string;
}

export const UploadButton = forwardRef<HTMLInputElement, UploadButtonProps>((props, ref) => {
  const { name, onFiles, multiple, accept, children, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(e.currentTarget?.files ?? []));
  }

  const onPress = () => {
    if (!rest.isDisabled && inputRef.current) {
      inputRef.current.click();
    }
  }

  return (
    <>
      <Button {...rest} onPress={onPress}>
        {children}
      </Button>
      <input
        ref={mergeRefs(ref, inputRef)}
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple={multiple}
        name={name}
        onChange={onChange}
      />
    </>
  )
});

