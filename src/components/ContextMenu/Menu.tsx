
import { AriaMenuProps } from '@react-types/menu';
import { CollectionChildren, Node } from '@react-types/shared';
import React, { useRef } from 'react';
import { AriaMenuOptions, useMenu, useMenuItem, useMenuTrigger } from 'react-aria';
import {
  MenuTriggerProps,
  TreeProps,
  TreeState,
  useMenuTriggerState,
  useTreeState
} from 'react-stately';

import { cx, Box, Button, CheckboxIcon, FocusRing, Group, Icon, Popover } from '@osuresearch/ui';
import { useHotkeys } from '@mantine/hooks';

export type Choice = {
  key: string

  /**
   * Human-readable label for this choice
   */
  label: string

  /**
   * Key combination for this choice.
   *
   * Example: `Mod+N`.
   *
   * Mod will automatically be converted for the appropriate OS.
   */
  accelerator?: string


  onClick: () => void;
}

export type MenuProps<T extends Choice> = MenuTriggerProps &
  AriaMenuProps<T> & {

    /** `Item` components only */
    children: CollectionChildren<T>;

    open?: boolean
    onClose?: () => void;

    /**
     * Element to position the menu relative to when opened.
     */
    target: React.ReactElement
  };

type ContextMenuItemProps<T extends Choice> = {
  state: TreeState<T>;
  node: Node<T>;

  onAction?: (key: React.Key) => void;
  onClose?: () => void;
};

function ContextMenuItem<T extends Choice>({ node, state, onAction, onClose }: ContextMenuItemProps<T>) {
  const ref = useRef<HTMLLIElement>(null);
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem<T>(
    { key: node.key, onAction, onClose },
    state,
    ref
  );

  const isSelectable = state.selectionManager.selectionMode !== 'none';

  return (
    <Box
      as="li"
      ref={ref}
      {...menuItemProps}
      className={cx(
        'outline-none',
        { 'cursor-pointer': !isDisabled },
        { 'cursor-not-allowed': isDisabled }
      )}
      c={isDisabled ? 'interactive-disabled' : 'neutral'}
      px="sm"
      py="xxs"
      miw={200}
      bgc={isFocused ? 'interactive-hover' : undefined}
    >
      <Group>
        {isSelectable && <CheckboxIcon isSelected={isSelected} />}
        {node.rendered}
      </Group>
    </Box>
  );
}

type MenuImplProps<T extends Choice> = TreeProps<T> & AriaMenuOptions<T>;

function MenuImpl<T extends Choice>(props: MenuImplProps<T>) {
  const state = useTreeState<T>(props);
  const ref = useRef<HTMLUListElement>(null);
  const { menuProps } = useMenu<T>(props, state, ref);

  const { onAction, onClose } = props;

  return (
    <FocusRing>
      <Box as="ul" ref={ref} {...menuProps}>
        {Array.from(state.collection).map((item) => {
          if (item.type === 'section') {
            return <div key={item.key}>TODO: Section support</div>;
          }

          return (
            <ContextMenuItem
              key={item.key}
              node={item}
              state={state}
              onAction={onAction}
              onClose={onClose}
            />
          );
        })}
      </Box>
    </FocusRing>
  );
}

/**
 * A menu displays a list of actions or options that a user can choose.
 */
export function Menu<T extends Choice>({ children, open, onClose, target, ...props }: MenuProps<T>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const state = useMenuTriggerState({
    isOpen: open,
    onOpenChange: (isOpen) => !isOpen && onClose && onClose(),
  });

  const { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, triggerRef);

  const accelerators = Array.from(props.items ?? []).filter((i) => !!i.accelerator);
  useHotkeys(accelerators.map((a) => (
    [a.accelerator as string, () => a.onClick()]
  )));

  const onAction = (key: React.Key) => {
    const selected = Array.from(props.items ?? []).find((i) => i.key === key);
    if (selected) {
      selected.onClick();
    }
  }

  return (
    <>
      {React.cloneElement(target, {
        ref: triggerRef,
        ...menuTriggerProps
      })}

      {state.isOpen && (
        <Popover state={state} triggerRef={triggerRef} placement="bottom left">
          <MenuImpl {...props} {...menuProps} onAction={onAction}>
            {children}
          </MenuImpl>
        </Popover>
      )}
    </>
  );
};
