import { faker } from '@faker-js/faker';
import { type PrimitiveAtom, atom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { useMemo } from 'react';

export type Person = {
  id: string;
  name: string;
  age: number;
  jobTitle: string;
};

type PeopleMap = Record<string, PrimitiveAtom<Person>>;

const initialPeople = Object.fromEntries(
  Array.from(Array(5))
    .map(() => buildPerson())
    .map((person) => [person.id, atom(person)])
);

const peopleMapAtom = atom<PeopleMap>(initialPeople);

function buildPerson(): Person {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    age: 18,
    jobTitle: faker.name.jobTitle(),
  };
}
export const addPersonAtom = atom(null, (_get, set, _update) => {
  set(peopleMapAtom, (current) => {
    const newPerson = buildPerson();
    return { ...current, [newPerson.id]: atom(newPerson) };
  });
});

export const peopleListAtom = atom((get) => Object.values(get(peopleMapAtom)));

export const removePersonAtom = atom(null, (_get, set, _update) => {
  set(peopleMapAtom, (current) => {
    const lastKey = Object.keys(current).at(-1) as string;
    const { [lastKey]: _delete, ...remainingPeople } = current;
    return remainingPeople;
  });
});

export function usePersonFieldAtom(entityAtom: PrimitiveAtom<Person>, accessor: keyof Person) {
  return useMemo(
    () => focusAtom(entityAtom, (optic) => optic.prop(accessor)),
    [entityAtom, accessor]
  );
}
