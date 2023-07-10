import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import { useDebouncedState } from './useDebouncedState';
import { useAppSelector } from '.';

export function useBooruTags() {
  const booruAPI = useAppSelector((s) => s.settings.integrations.booru);
  const [filter, setFilter] = useDebouncedState<string|undefined>('', 500);
  const [tags, setTags] = useState<BooruTag[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!filter) {
      setTags([]);
      setLoading(false);
      setError(undefined);
      return;
    }

    setLoading(true);

    axios.get(`${booruAPI}${filter}`)
      .then((res) => {
        const newTags = res.data.map((item: any) => ({
            id: uuid(),
            label: `${(item.antecedent ? `${item.antecedent  } → ` : '') + item.label}`,
            value: item.label,
            count: item.post_count,
            category: item.category,
          })
        );

        setTags(newTags);

        setLoading(false);
        setError(undefined);
        return newTags;
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, [filter, booruAPI]);

  return { loading, error, filter, setFilter, tags, categories, setCategories };
}
