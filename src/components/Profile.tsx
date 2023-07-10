import { IconButton, Avatar } from '@osuresearch/ui';
import styled from 'styled-components';

const Root = styled.div`
  outline: #fff solid 3px;
  border-radius: 50%;
`;

export default function Profile() {
  return (
    <Root>
      <Avatar alt="Chase" opicUsername="mcmanning.1" size={32} />
    </Root>
  );
}

