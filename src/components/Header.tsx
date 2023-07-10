import { Group, useTheme } from "@osuresearch/ui"
import styled from 'styled-components'
import { Logo } from "./Logo"
import { ToggleThemeButton } from "./ToggleThemeButton"

const GlassNavbar = styled.header`
  backdrop-filter: saturate(180%) blur(5px);

  /* TODO: Really do need RUI RGB tokens so I can do HSL magic. */
  background: ${(props) => props.theme.theme === 'light'
    ? 'rgba(255, 255, 255, .8)'
    : 'rgba(20, 21, 23, .8)'};

  z-index: 999;

  border-bottom: 1px solid var(--rui-light-shade);

  grid-area: header;
  position: sticky;
  top: 0;
`;

export function Header() {
  const { theme } = useTheme();

  return (
    <GlassNavbar theme={{ theme }}>
      <Group justify="apart" align="center">
        <Group px="lg" py="md" gap="lg">
          <Logo />

          <Group as="ul">
            <li>
              link
            </li>
          </Group>
        </Group>

        <ToggleThemeButton />
      </Group>
    </GlassNavbar>
  )
}
