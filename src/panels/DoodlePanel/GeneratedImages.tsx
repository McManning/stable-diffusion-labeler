import { Box, Button, ButtonBase, IconButton, Modal, Stack, Typography, styled } from "@mui/material";
import { Icon } from "@osuresearch/iconography";
import Image from "mui-image";
import { useState } from "react";
import { GenerateButton } from "./GenerateButton";
import { useAppSelector } from "@/hooks";

const Thumbnail = styled(ButtonBase)(({ theme }) => ({
  width: 128,
  minWidth: 128,
  height: 128,
  border: `1px solid ${theme.palette.background.paper}`,
  borderRadius: 6,
  padding: 2,
  marginRight: 4,
  background: '#000000',
}));

const Thumbnails = styled(Stack)(({ theme }) => ({
  maxWidth: '100%',
  overflowX: 'scroll',
  scrollbarColor: "#6b6b6b #2b2b2b",
  paddingBottom: 8,
  "&::-webkit-scrollbar": {
    backgroundColor: "transparent",
    height: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#6b6b6b",
  },
}));

const Lightbox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '85vw',

  // backgroundColor: theme.palette.background.paper,
  padding: 8,
  outline: 'none',

}));

const LightboxImage = styled(Image)(({ theme }) => ({
  background: '#000000',
  border: '2px solid #ffffff',
  borderRadius: 6,
}));

export function GeneratedImages() {
  const [preview, setPreview] = useState<number>();
  const allImages = useAppSelector((s) => s.generator.images);

  const images = allImages.filter((img) => img.type === 'txt2img');

  const onPrevImage = () => {
    if (preview === undefined) {
      return;
    }

    setPreview(preview < 1 ? images.length - 1 : preview - 1);
  }

  const onNextImage = () => {
    setPreview(((preview ?? -1) + 1) % images.length);
  }

  const onKeyUp = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'ArrowRight') {
      onNextImage();
    }
    else if (e.key === 'ArrowLeft') {
      onPrevImage();
    }
  }

  const previewed = (preview !== undefined && images[preview]) ? images[preview] : undefined;

  // TODO: Autoscroll when new images are added to make sure whatever the last
  // image in before a batch is the first visible in the list

  return (
    <Box position="absolute" bottom={8} left={8} right={8}>
      <Stack direction="row" width="100%" justifyContent="space-between" alignItems="end" gap={2}>
        <Thumbnails direction="row">
          {images.map((img, idx) =>
            <Thumbnail key={img.id} onClick={() => setPreview(idx)}>
              <Image
                src={img.src}
                duration={500}
                fit="contain"
              />
            </Thumbnail>
          )}
        </Thumbnails>
        <GenerateButton />
      </Stack>

      <Modal
        open={previewed !== undefined}
        onClose={() => setPreview(undefined)}
      >
        <Lightbox onKeyUp={onKeyUp}>
          {previewed &&
          <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
            <IconButton onClick={onPrevImage}>
              <Icon size={32} name="leftOutline" />
            </IconButton>
            <LightboxImage
              src={previewed.src}
              duration={500}
              fit="cover"
            />
            <IconButton onClick={onNextImage}>
              <Icon size={32} name="leftOutline" rotate={180} />
            </IconButton>
          </Stack>
          }
        </Lightbox>
      </Modal>
    </Box>
  )
}
