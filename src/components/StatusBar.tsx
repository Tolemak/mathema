import React, { useSyncExternalStore } from 'react';
import { categories } from '../data/mathProblems';
import { getBarFields, subscribeBarFields, type BarField } from '../utils/barStore';

const taskCount = categories.reduce((sum, category) => sum + category.questions.length, 0);

const DEFAULT_FIELDS: BarField[] = [
  { label: 'zadań', value: String(taskCount) },
  { label: 'działów', value: String(categories.length) },
];

const StatusBar: React.FC = () => {
  const fields = useSyncExternalStore(subscribeBarFields, getBarFields) ?? DEFAULT_FIELDS;

  return (
    <tolemak-bar app="mathema" home="https://kamil-galkowski.pl">
      {fields.map((field) => (
        <tolemak-field key={field.label} label={field.label} tone={field.tone}>
          {field.value}
        </tolemak-field>
      ))}
    </tolemak-bar>
  );
};

export default StatusBar;
