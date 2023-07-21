import { useDispatch } from 'react-redux';

import { DoodleLayer, selectId, setReferences } from '@/features/doodle';
import { useAppSelector } from '@/hooks';
import { Reference } from './Reference';

export interface ReferencesProps {
  layerId: string;
}

/**
 * Render references for a specific `DoodleLayer`.
 *
 * @param param0
 */
export function References({ layerId }: ReferencesProps) {
  const selectedId = useAppSelector((s) => s.doodle.selectedId);
  const references = useAppSelector((s) => s.doodle.references);

  const dispatch = useDispatch();

  const filtered = references.filter((r) => r.layerId === layerId);

  return (
    <>
      {filtered.map((r, i) => (
        <Reference
          key={r.id}
          reference={r}
          isSelected={r.id === selectedId}
          onSelect={() => {
            dispatch(selectId(r.id));

            // Bring to front
            const refs = references.slice();
            const index = refs.findIndex((x) => x.id === r.id);

            refs.splice(index, 1);
            refs.push(r);
            dispatch(setReferences(refs));
          }}
          onChange={(newAttrs) => {
            // const refs = references.slice();
            // refs[i] = newAttrs;
            // dispatch(setReferences(refs));
          }}
        />
      ))}
      {/* <Text x={0} y={0} text={selectedId ?? 'Not selected'} fill="red" /> */}
    </>
  );
}
