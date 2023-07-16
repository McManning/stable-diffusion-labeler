

export interface CursorProps {
  children: React.ReactNode
}

/**
 * Control for cursor dimensions
 */
export function Cursor({ children }: CursorProps) {

  return (
    <div>
      {children}
    </div>
  )
}
