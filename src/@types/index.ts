
type ImageIdentifier = number;

type BooruTag = {
  /**
   * Tag IDs are used for uniquely identifying tags
   */
  id: string
  label: string
  value: string
  count?: string
  category?: number
}

/** Mapping of category to tag(s) */
type GlobalTags = Record<string, string[]>;

type ImageSearchFilter = {
  terms?: string
  untagged?: boolean
}

type TrainingImage = {
  /** Unique identifier. Required for sorting and filtering */
  id: string

  /** File name */
  name: string

  /** Labeling tags */
  tags: string[]
}

type WorkspaceFolder = {
  path: string
}

type Workspace = {
  /** Unique workspace identifier */
  id: string

  name: string
  path?: string
  folders: WorkspaceFolder[]
  images: TrainingImage[]
}

type Point = {
  x: number
  y: number
}

type Region = {
  id: number
  color: string
  points: Point[]
}

type Label = {
  id: number
  text?: string
  keepRatio?: boolean
  isBoxCut?: boolean
  color: string
  x: number
  y: number
  w: number
  h: number
}

/**
 * An operation on one or more images that can be undo/redo'd
 */
type Operation = {
  type: 'delete' | 'tag' | ''
  image: TrainingImage[]

  /** Previous state before the operation. Depends on operation type */
  prev: any

  /** Next state after the operation. Depends on operation type */
  next: any
}
