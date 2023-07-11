
import { Box, styled } from '@mui/material';
import Image from 'mui-image';

export interface ThumbnailProps {
  image: TrainingImage
  isSelected: boolean
  size: number
}

const Root = styled(Box)<ThumbnailProps>(({ isSelected, theme }) => ({
  padding: 2,
  outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: 9,
  width: '100%',
  height: '100%',
  background: isSelected
    ? '#111827' // theme.palette.primary.dark
    : theme.palette.background.default,
}));

export function Thumbnail(props: ThumbnailProps) {
  const { image, size } = props;

  return (
    <Root
      {...props}
      sx={{ width: size, height: size, minWidth: size }}
    >
      <Image
        alt=""
        fit="contain"
        src={`file-protocol://getTrainingImage/${image.name}`}
        width="100%"
        height="100%"
        duration={500}
      />
    </Root>
  )
}
