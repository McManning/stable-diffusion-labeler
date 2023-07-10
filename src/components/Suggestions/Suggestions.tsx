
export type SuggestionsProps = {
  top: number
  left: number
}

export function Suggestions({ top, left }: SuggestionsProps) {
  return (
    <div>
      this is a list of options, similar to VSCode how it
      follows the text and will try to autocomplete where possible.
    </div>
  )
}
