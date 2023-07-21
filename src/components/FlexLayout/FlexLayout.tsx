
import React, { useEffect, useState } from 'react';
import { Layout, Model, TabNode } from "flexlayout-react";
import { Box, alpha, styled } from '@mui/material';
import { Icon } from '@osuresearch/ui';

import { ImageInfoPanel } from '@/panels/TaggingPanel';
import { GlobalTagsPanel } from '@/panels/GlobalTagsPanel';
import { BooruTagsPanel } from '@/panels/BooruTagsPanel';

import { ProjectPanel } from '@/panels/ProjectPanel';
import { SettingsPanel } from '@/panels/SettingsPanel';

import { PromptPanel } from '@/panels/PromptPanel';
import { ControlNetPanel } from '@/panels/ControlNetPanel';
import { BlendPanel } from '@/panels/BlendPanel';
import { SamplerPanel } from '@/panels/SamplerPanel';
import { SearchPanel } from '@/panels/SearchPanel';
import { DoodlePanel } from '@/panels/DoodlePanel';

import { Canvas } from '@/components/Canvas';
import { useAppSelector } from '@/hooks';

import './FlexLayout.css';

// Connection between FlexLayout CSS variables and the MUI theme system
// TODO: Clean this up further. Remove the --color-N values and just assign
// directly (some are also used in the base CSS file)
const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  // height: 'calc(100vh - 40px)', // Account for the header bar.
  height: '100vh',

  '--color-1': '#374151', // 'var(--rui-surface-subtle)', /* dividers */
  '--color-2':  theme.palette.background.default, // 'var(--rui-surface-subtle)', /* toolbar button hover */
  '--color-3': '#ff00ff',
  '--color-4': theme.palette.primary.main, /* Splitter drag / hover */
  '--color-5': '#ff00ff', /* Unused */
  '--color-6': theme.palette.action.hover, /* Drag / popup border / hover for popup menu item */
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

export type FlexLayoutProps = {


}

/**
 * Wrapper around the [FlexLayout React](https://github.com/caplin/FlexLayout)
 * component that integrates with RUI components
 *
 * @param props
 * @returns
 */
export function FlexLayout(props: FlexLayoutProps) {

  const [model, setModel] = useState<Model>();

  const activeTab = useAppSelector((s) => s.workspace.activeTab);

  useEffect(() => {
    if (activeTab === 'doodle') {
      setModel(Model.fromJson({
        global: {
          // tabSetEnableTabStrip: false,
          tabEnableRename: false,
          tabEnableClose: false,
          tabSetEnableMaximize: false,
          tabSetMinWidth: 400,
          tabSetMinHeight: 100,
          splitterSize: 2,
          splitterExtra: 6,
        },
        borders: [],
        layout: {
          type: 'row',
          children: [
            {
              type: 'row',
              weight: 80,
              children: [
                {
                  type: 'tabset',
                  weight: 100,
                  enableTabStrip: false,
                  children: [
                    {
                      type: 'tab',
                      name: 'Doodle',
                      component: 'doodle'
                    },
                  ]
                },
              ],
            },
            {
              type: 'row',
              weight: 20,
              children: [
                {
                  type: 'tabset',
                  weight: 40,
                  children: [
                    {
                      type: 'tab',
                      name: 'Prompt',
                      component: 'prompt',
                    },
                  ]
                },
                {
                  type: 'tabset',
                  weight: 60,
                  children: [
                    {
                      type: 'tab',
                      name: 'Blend',
                      component: 'blend',
                    },
                    {
                      type: 'tab',
                      name: 'Sampler',
                      component: 'sampler',
                    },
                    {
                      type: 'tab',
                      name: 'ControlNet',
                      component: 'controlNet',
                    },
                    {
                      type: 'tab',
                      name: 'Settings',
                      component: 'settings',
                      enableClose: true,
                    },
                  ]
                }
              ],
            }
          ]
        },
      }));
    }
    else {
      // Everything else is the same model for now
      setModel(Model.fromJson({
        global: {
          // tabSetEnableTabStrip: false,
          tabEnableRename: false,
          tabEnableClose: false,
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
              children: [
                {
                  type: 'tab',
                  name: 'Project',
                  component: 'project',
                },
                {
                  type: 'tab',
                  name: 'Search',
                  component: 'search',
                }
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
                      component: 'canvas'
                    },
                    {
                      type: 'tab',
                      name: 'Settings',
                      component: 'settings',
                    }
                  ]
                },
                {
                  type: 'tabset',
                  weight: 25,
                  children: [
                    {
                      type: 'tab',
                      name: 'Tagging',
                      component: 'tagging'
                    },
                    {
                      type: 'tab',
                      name: 'Prompt',
                      component: 'prompt',
                    },
                  ]
                }
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
          ]
        }
      }));
    }
  }, [activeTab]);

  const factory = (node: TabNode) => {
    const component = node.getComponent();

    const mapping: Record<string, any> = {
      project: ProjectPanel,
      search: SearchPanel,
      canvas: Canvas,
      tagging: ImageInfoPanel,
      booruTags: BooruTagsPanel,
      globalTags: GlobalTagsPanel,
      settings: SettingsPanel,
      prompt: PromptPanel,
      controlNet: ControlNetPanel,
      blend: BlendPanel,
      sampler: SamplerPanel,
      doodle: DoodlePanel,
    };

    if (component && mapping[component]) {
      const Component = mapping[component];
      return <Component />;
    }

    return null;
  }

  if (!model) {
    return null;
  }

  return (
    <Root>
      <Layout
        supportsPopout={false}
        icons={{
          close: <Icon name="xmark" size={14} />
        }}
        model={model}
        factory={factory}
        realtimeResize
      />
    </Root>
  )
}
