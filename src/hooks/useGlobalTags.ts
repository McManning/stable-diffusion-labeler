import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import { useDebouncedState } from './useDebouncedState';

const MOCK: GlobalTags = {
  'Globals': [
    'finn',
    'jake',
  ],
  'Type of X': [
    'full body',
    'close up',
    'cowboy shot',
    'cropped',
    'filtered',
    'black and white',
    'landscape',
    '80s style',
  ],
  'Perspectives': [
    'from above',
    'from below',
    'from front',
    'from behind',
    'from side',
    'forced perspective',
    'tilt-shifted',
    'depth of field',
  ],
  'Action words': [
    'standing',
    'sitting',
    'leaning',
    'arms above head',
    'walking',
    'running',
    'jumping',
    'one arm up',
    'one leg out',
    'elbows bent',
    'posing',
    'kneeling',
    'stretching',
    'arms in front',
    'knee bent',
    'lying down',
    'looking away',
    'looking up',
    'looking at viewer',
  ],
  'Person descriptions': [
    'white hat',
    'blue shirt',
    'silver necklace',
    'sunglasses',
    'pink shoes',
    'blonde hair',
    'silver bracelet',
    'green jacket',
    'large backpack',
    'pink petals',
  ],
  'Flower descriptions': [
    'pink petals',
    'green leaves',
    'tall',
    'straight',
    'thorny',
    'round leaves',
  ],
  'Background layer 1': [
    'outdoors',
    'beach',
    'sand',
    'water',
    'shore',
    'sunset',
  ],
  'Background layer 2': [
    'small waves',
    'ships out at sea',
    'sandcastle',
    'towels',
  ],
  'Background layer 3': [
    'the ships are red and white',
    'the sandcastle has a moat around it',
    'the towels are red with yellow stripes',
  ],
  'Loose associations': [
    'happy',
    'sad',
    'joyous',
    'hopeful',
    'lonely',
    'sombre'
  ]
}

export function useGlobalTags() {
  const [filter, setFilter] = useDebouncedState<string|undefined>('', 50);
  const [available, setAvailable] = useState<GlobalTags>(MOCK);
  const [tags, setTags] = useState<GlobalTags>({});
  const [categories, setCategories] = useState<string[]>([]);

  // Super simple tag filtering from the global set
  useEffect(() => {
    if (!filter) {
      setTags(MOCK);
      return;
    }

    const filtered: GlobalTags = {};
    Object.keys(available).forEach((section) => {
      available[section].forEach((tag) => {
        if (tag.includes(filter)) {
          if (!filtered[section]) {
            filtered[section] = [tag];
          } else {
            filtered[section].push(tag);
          }
        }
      });
    })

    setTags(filtered)
  }, [available, filter]);

  return { filter, setFilter, tags, categories, setCategories };
}
