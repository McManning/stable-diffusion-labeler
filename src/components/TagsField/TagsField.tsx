import { forwardRef, useEffect, useRef, useState } from 'react';

import { WithContext as ReactTags } from 'react-tag-input';

import styles from './index.module.css';
import {
  Box,
  BoxProps,
  FormControl,
  FormHelperText,
  Input,
  InputBase,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';

import { styled, alpha } from '@mui/material/styles';

export type Tag = {
  id: string;
  text: string;
  className?: string;
};

export interface TagsFieldProps {
  label: React.ReactNode;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

interface TagsProps extends BoxProps {
  focused?: boolean;
}

const Tags = styled(Box)<TagsProps>(({ focused, theme }) => ({
  borderRadius: 3,
  display: 'inline-block',
  outlineOffset: '0',
  width: '100%',

  // TODO: Replicating MUI's input styles without using their input is... painful.
  // I'm not seeing an equivalent to RUI's <Interactive /> for arbitrary reusable
  // interactive states. But I could be missing it somewhere.

  '& .ReactTags__tags': {
    position: 'relative',
    border: '2px solid #49525c', // TODO: Color comes from where?
    borderColor: focused ? theme.palette.primary.main : '#49525c',
    borderRadius: 3,
    padding: 4,
  },
  '& .ReactTags__tag': {
    display: 'inline-block',
    background: theme.palette.background.default,
    borderRadius: 3,
    padding: '2px 2px 2px 6px',
    margin: 1,
  },
  '& .ReactTags__remove': {
    border: 'none',
    background: 'none',
  },
  '& .ReactTags__tagInput': {
    width: 200,
    display: 'inline-block',
    marginLeft: 4,
  },
  '& .ReactTags__tagInputField, & .ReactTags__editTagInputField': {
    fontSize: '1rem',
    display: 'inline-block',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    '&::placeholder': {
      color: '#FFF',
    },
  },
  '& .ReactTags__suggestions': {
    position: 'absolute',
    marginTop: -10,
    ul: {
      color: theme.palette.text.primary,
      listStyleType: 'none',
      background: theme.palette.grey[900],
      width: 200,
      padding: 0,
    },
    li: {
      padding: '4px 12px',
    },
  },
  '& .ReactTags__activeSuggestion': {
    cursor: 'pointer',
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  },

  // Tag classes in ReactTags
  '& .tag-weighted': {
    color: 'red',
  },
  '& .tag-lora': {
    color: 'green',
  },
}));

/**
 * Does the tag represent a LoRA (*or* a LyCORIS)
 */
function isLoRA(tag: Tag): boolean {
  const text = tag.text.trim();
  return text.startsWith('<lora:') || text.startsWith('<lyco:');
}

function isWeighted(tag: Tag): boolean {
  const text = tag.text.trim();
  return text.startsWith('(');
}

/**
 * Assign `className` based on tag value
 */
function assignTagClass(tag: Tag): Tag {
  if (isWeighted(tag)) {
    tag.className = 'tag-weighted';
  } else if (isLoRA(tag)) {
    tag.className = 'tag-lora';
  }

  return { ...tag };
}

function textToTags(text: string): Tag[] {
  return text
    .split(',')
    .filter((t) => t.length)
    .map<Tag>((t) => assignTagClass({ id: t, text: t }));
}

function tagsToText(tags: Tag[]): string {
  return tags.map((t) => t.id.trim()).join(', ');
}

export function TagsField(props: TagsFieldProps) {
  const { label, name, value, onChange } = props;

  const [focused, setFocused] = useState(false);

  // TODO:
  const suggestions: Tag[] = [
    { id: 'Japan', text: 'Japan' },
    { id: 'Jargon', text: 'Jargon' },
  ];

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(textToTags(value ?? ''));
  }, [value]);

  const replaceTags = (newTags: Tag[]) => {
    setTags(newTags);
    if (onChange) {
      onChange(tagsToText(newTags));
    }
  };

  const handleDelete = (i: number) => {
    replaceTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    replaceTags([...tags, assignTagClass(tag)]);
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    replaceTags(newTags);
  };

  const handleTagClick = (index: number) => {
    console.log(`The tag at index ${index} was clicked`);

    // TODO: Lora/Lyco get special treatment here for adding a slider.
  };

  const handleTagUpdate = (index: number, tag: Tag) => {
    tags[index] = assignTagClass(tag);
    replaceTags([...tags]);
  };

  const handleInputBlur = (textInputValue: string) => {
    if (textInputValue.length > 0) {
      handleAddition({ id: textInputValue, text: textInputValue });
    }
    setFocused(false);
  };

  return (
    <Tags focused={focused}>
      <Typography component="label" htmlFor={name} display="block" mb={1}>
        {label}
      </Typography>
      <ReactTags
        id={name}
        name={name}
        placeholder="Add tag..."
        aria-describedby={`${name}-help`}
        tags={tags}
        suggestions={suggestions}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        handleInputFocus={() => setFocused(true)}
        handleInputBlur={handleInputBlur}
        inputFieldPosition="inline"
        autocomplete
        inline
        // @ts-ignore - type information is out of date.
        editable
        onTagUpdate={handleTagUpdate}
      />
    </Tags>
  );
}
