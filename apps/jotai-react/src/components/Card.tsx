import { classNames } from '@/utils';
import { type PropsWithChildren } from 'react';

export function Card(props: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames(
        'bg-white dark:bg-slate-800 rounded-md shadow-md p-4 dark:text-slate-50',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
