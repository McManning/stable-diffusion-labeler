import { useDispatch } from 'react-redux';
import { useAppSelector } from '.';
import { useEffect, useState } from 'react';
import { setSearchFilter } from '@/features/workspace';
import { isMatch, searchTags } from '@/utils';

export function useActiveWorkspace() {
  const workspace = useAppSelector((s) => s.workspace.activeWorkspace);
  const images = useAppSelector(
    (s) => s.workspace.activeWorkspace?.images ?? []
  );

  return {
    workspace,
    images,
  };
}
