import { useState } from "react";
import { useAppSelector } from ".";

export function useControlNet() {
  // TODO: should probably put these @ the generator level in Redux.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const sampler = useAppSelector((s) => s.generator.sampler);
  const settings = useAppSelector((s) => s.settings.integrations);

  return [loading, error, images]
}
