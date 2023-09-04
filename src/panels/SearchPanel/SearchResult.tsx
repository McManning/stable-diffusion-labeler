import { setActiveImage } from '@/features/workspace';
import { useActiveImage } from '@/hooks/useActiveImage';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import {
  ButtonBase,
  Stack,
  Typography,
  styled,
  IconButton,
} from '@mui/material';
import { Icon } from '@osuresearch/ui';
import { useDispatch } from 'react-redux';

export interface SearchResultProps {
  result: ImageSearchResult;
}

const Del = styled('del')(({ theme }) => ({
  background: theme.palette.error.main,
  color: theme.palette.error.contrastText,
}));

const Ins = styled('ins')(({ theme }) => ({
  background: theme.palette.success.main,
  color: theme.palette.success.contrastText,
}));

const Button = styled(ButtonBase)<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
    width: 'calc(100% - 4px)',
    padding: 2,
    margin: 2,
    justifyContent: 'left',
    textAlign: 'left',
    overflowX: 'hidden',
  })
);

export function SearchResult({ result }: SearchResultProps) {
  const { image: activeImage } = useActiveImage();
  const { setImage } = useCanvasInteractions();
  const dispatch = useDispatch();

  const onSelect = () => {
    // TODO: Don't need both here
    setImage(result.image);
    dispatch(setActiveImage(result.image));
  };

  const isSelected = activeImage?.id === result.image.id;

  return (
    <Button onClick={onSelect} isSelected={isSelected}>
      <Stack width="100%">
        {/* <IconButton
          onClick={onRemoveMatch}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 22,
            height: 22,
          }}
        >
          <Icon name="xmark" size={12} />
        </IconButton> */}
        <Typography
          component="div"
          fontSize={12}
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            // marginRight: 3,
            display: 'block',
          }}
        >
          {result.image.id}
        </Typography>

        {result.tags.map((tag) => (
          <Typography key={tag.match} fontSize={14} pl={2}>
            {tag.replace && (
              <>
                <Del>{tag.match}</Del> <Ins>{tag.replace}</Ins>
              </>
            )}
            {!tag.replace && tag.match}
          </Typography>
        ))}
      </Stack>
    </Button>
  );
}
