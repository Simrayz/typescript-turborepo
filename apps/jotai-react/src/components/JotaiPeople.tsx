import { Card } from '@/components';
import { atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { faker } from '@faker-js/faker';

type Person = {
  id: string;
  name: string;
  age: number;
};

type PeopleMap = Record<string, PrimitiveAtom<Person>>;

const peopleMapAtom = atom<PeopleMap>({});

function buildPerson(): Person {
  return { id: faker.datatype.uuid(), name: faker.name.fullName(), age: 18 };
}
const addPersonAtom = atom(null, (_get, set, _update) => {
  set(peopleMapAtom, (current) => {
    const newPerson = buildPerson();
    return { ...current, [newPerson.id]: atom(newPerson) };
  });
});

const peopleListAtom = atom((get) => Object.values(get(peopleMapAtom)));

const removePersonAtom = atom(null, (_get, set, _update) => {
  set(peopleMapAtom, (current) => {
    const lastKey = Object.keys(current).at(-1) as string;
    const { [lastKey]: _delete, ...remainingPeople } = current;
    return remainingPeople;
  });
});

export function JotaiPeople() {
  const peopleAtoms = useAtomValue(peopleListAtom);
  const addPerson = useSetAtom(addPersonAtom);
  const removePerson = useSetAtom(removePersonAtom);

  return (
    <Card className="w-96 space-y-2">
      <h2 className="text-xl">Jotai People</h2>
      <div className="flex items-center gap-2">
        <button
          className="bg-purple-500 text-white hover:bg-purple-400 rounded-md px-2 py-1"
          onClick={addPerson}
        >
          Add Person
        </button>
        <button
          className="bg-purple-500 text-white hover:bg-purple-400 rounded-md px-2 py-1"
          onClick={removePerson}
        >
          Remove Person
        </button>
      </div>
      <table className="table-fixed border-collapse w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {peopleAtoms.length ? (
            peopleAtoms.map((personAtom) => (
              <PersonListItem personAtom={personAtom} key={personAtom.toString()} />
            ))
          ) : (
            <tr>
              <td colSpan={3}>No people yet. Add someone?</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function PersonListItem(props: { personAtom: PrimitiveAtom<Person> }) {
  const [person, setPerson] = useAtom(props.personAtom);

  if (!person) return null;

  return (
    <tr className="text-center border-2">
      <td className="border-2">{person.name}</td>
      <td className="border-2">{person.age}</td>
      <td>
        <button
          className="hover:bg-purple-200 rounded-md p-1 my-1"
          onClick={() => setPerson({ ...person, age: person.age + 1 })}
        >
          Age Up
        </button>
      </td>
    </tr>
  );
}
