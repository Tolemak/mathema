import React, { useSyncExternalStore } from 'react';
import { categories } from '../data/mathProblems';
import { useI18n } from '../i18n/useI18n';
import { getBarFields, subscribeBarFields, type BarField } from '../utils/barStore';

const taskCount = categories.reduce((sum, category) => sum + category.questions.length, 0);

const StatusBar: React.FC = () => {
  const { t } = useI18n();
  const defaults: BarField[] = [
    { label: t('bar.tasks'), value: String(taskCount) },
    { label: t('bar.sections'), value: String(categories.length) },
  ];
  const fields = useSyncExternalStore(subscribeBarFields, getBarFields) ?? defaults;

  return (
    <tolemak-bar app="mathema" home="https://kamil-galkowski.pl" langs="pl,en">
      {fields.map((field) => (
        <tolemak-field key={field.label} label={field.label} tone={field.tone}>
          {field.value}
        </tolemak-field>
      ))}
    </tolemak-bar>
  );
};

export default StatusBar;
