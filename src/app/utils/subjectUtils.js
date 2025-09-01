import i18n from '@/i18n/i18n';
import { convertToSnakeCase } from './stringUtils';

export const getSubjects = (language = null) => {
  const lng = language || i18n.language;

  const subjects = i18n.t('subjects', {
    returnObjects: true,
    lng: lng
  });

  return Object.keys(subjects)
    .map(key => subjects[key])
    .sort((a, b) => a.localeCompare(b));
};


export const getSubjectTranslation = (subject) => {
  const subjectKey = convertToSnakeCase(subject)
  return i18n.t(`subjects.${subjectKey}`, subjectKey);
};

export const getCriteria = () => {
  const criteriaKeys = [
    'Teaching Quality',
    'Engagement',
    'Fairness',
    'Support',
    'Ease'
  ];

  return criteriaKeys.map(key => ({
    key,
    name: i18n.t(`ratingCriteria.${key}.name`),
    description: i18n.t(`ratingCriteria.${key}.description`),
    icon: i18n.t(`ratingCriteria.${key}.icon`)
  }));
};

