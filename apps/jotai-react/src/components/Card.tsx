import { classNames } from '@/utils';
import { type PropsWithChildren } from 'react';

export function Card(props: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames('bg-white rounded-md shadow-md p-4', props.className)}>
      {props.children}
    </div>
  );
}
