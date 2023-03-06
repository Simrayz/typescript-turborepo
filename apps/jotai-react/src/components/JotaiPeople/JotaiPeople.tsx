import { addPersonAtom, peopleListAtom, type Person, removePersonAtom } from './peopleState';
import { Card } from '@/components';
import { useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai';
import { type SetStateAction, useState, type ChangeEvent } from 'react';

export function JotaiPeople() {
  const peopleAtoms = useAtomValue(peopleListAtom);
  const addPerson = useSetAtom(addPersonAtom);
  const removePerson = useSetAtom(removePersonAtom);

  return (
    <Card className="space-y-2">
      <h2 className="text-xl">Jotai People</h2>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={addPerson}>
          Add Person
        </button>
        <button className="btn" onClick={removePerson}>
          Remove Person
        </button>
      </div>
      <table className="table table-compact table-fixed table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Job Title</th>
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
    <tr>
      <EditableTextCell entity={person} setEntity={setPerson} accessor="name" />
      <EditableTextCell entity={person} setEntity={setPerson} accessor="age" type="number" />
      <EditableTextCell entity={person} setEntity={setPerson} accessor="jobTitle" />
      <td>
        <button
          className="btn btn-secondary"
          onClick={() => setPerson({ ...person, age: person.age + 1 })}
        >
          Age Up
        </button>
      </td>
    </tr>
  );
}

type EditableTextCellProps<T> = {
  accessor: keyof T;
  entity: T;
  setEntity: (value: SetStateAction<T>) => void;
  type?: 'text' | 'number';
};
function EditableTextCell<T extends Record<string, unknown>>({
  entity,
  setEntity,
  accessor,
  type = 'text',
}: EditableTextCellProps<T>) {
  const currentEntityValue =
    type === 'number' ? (entity[accessor] as number) : (entity[accessor] as string);

  return (
    <td>
      <input
        type={type}
        placeholder={`Type ${accessor as string} here`}
        className="input input-sm input-ghost w-full max-w-xs"
        value={currentEntityValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setEntity({
            ...entity,
            [accessor]: type === 'number' ? event.target.valueAsNumber : event.target.value,
          })
        }
      />
    </td>
  );
}
