import {
  addPersonAtom,
  peopleListAtom,
  removePersonAtom,
  usePersonFieldAtom,
  type Person,
} from './peopleState';
import { Card } from '@/components';
import { useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai';
import { type ChangeEvent } from 'react';

export function JotaiPeople() {
  const peopleAtoms = useAtomValue(peopleListAtom);
  const addPerson = useSetAtom(addPersonAtom);
  const removePerson = useSetAtom(removePersonAtom);

  return (
    <Card className="space-y-2">
      <h2 className="text-xl">Jotai Adult People</h2>
      <div className="flex items-center gap-2">
        <button className="btn btn-sm" onClick={addPerson}>
          Add Person
        </button>
        <button className="btn btn-sm" onClick={removePerson}>
          Remove Person
        </button>
      </div>
      <table className="table table-compact table-fixed table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Job Title</th>
            <th>Adjust age</th>
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
  return (
    <tr>
      <EditableTextCell personAtom={props.personAtom} accessor="name" />
      <EditableTextCell personAtom={props.personAtom} accessor="age" type="number" />
      <EditableTextCell personAtom={props.personAtom} accessor="jobTitle" />
      <AgeUpCell personAtom={props.personAtom} />
    </tr>
  );
}

type EditableTextCellProps<T> = {
  accessor: keyof T;
  personAtom: PrimitiveAtom<T>;
  type?: 'text' | 'number';
};

function EditableTextCell({ personAtom, accessor, type = 'text' }: EditableTextCellProps<Person>) {
  const [fieldValue, setFieldValue] = useAtom(usePersonFieldAtom(personAtom, accessor));

  return (
    <td>
      <input
        type={type}
        placeholder={`Type ${accessor as string} here`}
        className="input input-sm input-ghost w-full max-w-xs"
        value={fieldValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFieldValue(type === 'number' ? event.target.valueAsNumber : event.target.value)
        }
      />
    </td>
  );
}

type AgeUpCellProps = {
  personAtom: PrimitiveAtom<Person>;
};
function AgeUpCell({ personAtom }: AgeUpCellProps) {
  const [personAge, setPersonAge] = useAtom(usePersonFieldAtom(personAtom, 'age'));

  function adjustAge(amount: number) {
    setPersonAge((previous) => {
      const previousAge = previous as number;
      if (previousAge + amount < 18) return previous;
      return previousAge + amount;
    });
  }

  return (
    <td>
      <div className="flex gap-1">
        {[1, 5, 10, -1, -5, -10].map((amount) => (
          <button
            key={'adjust-age-button-' + amount.toString()}
            className="btn btn-ghost btn-xs"
            disabled={amount < 0 && (personAge as number) + amount < 18}
            onClick={() => adjustAge(amount)}
          >
            {`${amount > 0 ? '+ ' + amount.toString() : amount}`}
          </button>
        ))}
      </div>
    </td>
  );
}
