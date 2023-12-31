import React, { useEffect, useState } from 'react';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Box, alpha, styled } from '@mui/material';
import { Icon } from '@osuresearch/ui';

import { ImageInfoPanel } from '@/panels/ImageInfoPanel';
import { GlobalTagsPanel } from '@/panels/GlobalTagsPanel';
import { BooruTagsPanel } from '@/panels/BooruTagsPanel';

import { ProjectPanel } from '@/panels/ProjectPanel';
import { SettingsPanel } from '@/panels/SettingsPanel';
import { SearchPanel } from '@/panels/SearchPanel';
import { CanvasPanel } from '@/panels/CanvasPanel';

import { useAppSelector } from '@/hooks';

import './FlexLayout.css';
import { SidebarPanel } from '@/panels/SidebarPanel';

// Connection between FlexLayout CSS variables and the MUI theme system
// TODO: Clean this up further. Remove the --color-N values and just assign
// directly (some are also used in the base CSS file)
const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 'calc(100dvh - 32px)', // Account for the header bar.

  '--color-1': '#374151', // 'var(--rui-surface-subtle)', /* dividers */
  '--color-2': theme.palette.background.default, // 'var(--rui-surface-subtle)', /* toolbar button hover */
  '--color-3': '#ff00ff',
  '--color-4': theme.palette.primary.main /* Splitter drag / hover */,
  '--color-5': '#ff00ff' /* Unused */,
  '--color-6':
    theme.palette.action
      .hover /* Drag / popup border / hover for popup menu item */,
  '--color-drag1': 'rgb(95, 134, 196)',
  '--color-drag2': 'rgb(119, 166, 119)',
  '--color-drag1-background': 'rgba(95, 134, 196, 0.1)',
  '--color-drag2-background': 'rgba(119, 166, 119, 0.075)',
  '--font-size': '0.8rem',
  '--font-family': theme.typography.fontFamily,
  '--color-overflow': '#ffffff',
  '--color-icon': '#ffffff',

  '--color-tabset-background': theme.palette.background.paper,
  '--color-tabset-background-selected': theme.palette.background.paper,

  '--color-tabset-divider-line': 'var(--rui-light)',
  '--color-tabset-header-background': 'var(--rui-surface)',
  '--color-tabset-header': 'var(--rui-surface-inverse)',
  '--color-border-background': 'var(--rui-surface)',
  '--color-border-divider-line': 'var(--color-3)',

  '--color-tab-selected': theme.palette.text.secondary,
  '--color-tab-selected-background': 'transparent',
  '--color-tab-unselected': theme.palette.text.secondary,
  '--color-tab-unselected-background': 'transparent',
  '--color-tab-textbox': '#ff00ff',
  '--color-tab-textbox-background': '#ff00ff',

  '--color-border-tab-selected': '#ff00ff',
  '--color-border-tab-selected-background': 'transparent',
  '--color-border-tab-unselected': 'gray',
  '--color-border-tab-unselected-background': 'transparent',

  '--color-splitter': 'var(--color-1)',
  '--color-splitter-hover': 'var(--color-4)',
  '--color-splitter-drag': 'var(--color-4)',
  '--color-drag-rect-border': 'var(--color-6)',
  '--color-drag-rect-background': 'var(--color-4)',
  '--color-drag-rect': 'var(--rui-surface-inverse)',

  '--color-popup-border': 'transparent',
  '--color-popup-unselected': theme.palette.text.primary,
  '--color-popup-unselected-background': theme.palette.grey[900],
  '--color-popup-selected': 'var(--rui-surface-inverse)',
  '--color-popup-selected-background': 'var(--color-3)',

  '--color-edge-marker': 'gray',
  '--color-underline': theme.palette.primary.main,
  '--color-underline-hover': alpha(theme.palette.primary.main, 0.8),
  '--underline-height': '2px',
}));

export type FlexLayoutProps = {};

const MODEL = Model.fromJson({
  global: {
    tabSetEnableTabStrip: true,
    tabEnableRename: false,
    tabEnableClose: false,
    tabSetEnableMaximize: false,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    splitterSize: 2,
    splitterExtra: 6,
  },
  borders: [],
  layout: {
    type: 'row',
    children: [
      {
        type: 'tabset',
        weight: 20,
        minWidth: 345,
        children: [
          {
            type: 'tab',
            name: 'Project',
            component: 'sidebar',
          },
          // {
          //   type: 'tab',
          //   name: 'Project',
          //   component: 'project',
          // },
          // {
          //   type: 'tab',
          //   name: 'Search',
          //   component: 'search',
          // },
        ],
      },
      {
        type: 'row',
        weight: 80,
        children: [
          {
            type: 'tabset',
            weight: 75,
            children: [
              {
                type: 'tab',
                name: 'Canvas',
                component: 'canvas',
              },
              {
                type: 'tab',
                name: 'Settings',
                component: 'settings',
              },
            ],
          },
          {
            type: 'tabset',
            weight: 25,
            children: [
              {
                type: 'tab',
                name: 'Image Info',
                component: 'imageInfo',
              },
            ],
          },
        ],
      },
      // {
      //   type: 'tabset',
      //   weight: 20,
      //   children: [
      //     // {
      //     //   type: 'tab',
      //     //   name: 'Booru tags',
      //     //   component: 'booruTags',
      //     // },
      //     // {
      //     //   type: 'tab',
      //     //   name: 'Global tags',
      //     //   component: 'globalTags',
      //     // },
      //   ]
      // },
    ],
  },
});

/**
 * Wrapper around the [FlexLayout React](https://github.com/caplin/FlexLayout)
 * component that integrates with RUI components
 *
 * @param props
 * @returns
 */
export function FlexLayout(props: FlexLayoutProps) {
  const factory = (node: TabNode) => {
    const component = node.getComponent();

    const mapping: Record<string, any> = {
      project: ProjectPanel,
      search: SearchPanel,
      canvas: CanvasPanel,
      imageInfo: ImageInfoPanel,
      booruTags: BooruTagsPanel,
      globalTags: GlobalTagsPanel,
      settings: SettingsPanel,
      sidebar: SidebarPanel,
    };

    if (component && mapping[component]) {
      const Component = mapping[component];
      return <Component />;
    }

    return null;
  };

  return (
    <Root>
      <Layout
        supportsPopout={false}
        icons={{
          close: <Icon name="xmark" size={14} />,
        }}
        model={MODEL}
        factory={factory}
        realtimeResize
      />
    </Root>
  );
}
