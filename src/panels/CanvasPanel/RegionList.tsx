import { useAppSelector } from "@/hooks";
import { setRegions } from "@/features/canvas";
import { useDispatch } from "react-redux";
import { Button } from "@osuresearch/ui";


export function RegionList() {
  const dispatch = useDispatch();
  const regions = useAppSelector((s) => s.canvas.regions);
  const selectedRegion = useAppSelector((s) => s.canvas.selectedId);

  const remove = (index: number) => {
    dispatch(setRegions([
      ...regions.slice(0, index),
      ...regions.slice(index + 1)
    ]))
  }

  return (
    <div>
      <Button onPress={() => dispatch(setRegions([]))}>
        Clear
      </Button>
      <ul>
        {regions.map((region, key) => <li key={region.id}>
          Region {region.id}
          <Button onPress={() => remove(key)}>
            Remove
          </Button>
        </li>)}
      </ul>
    </div>
  );
}
