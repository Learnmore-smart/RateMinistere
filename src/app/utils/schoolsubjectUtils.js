import i18n from '@/i18n/i18n';

export const getCriteria = () => {
  const criteriaKeys = [
    'Academic-Focus',
    'Support-System',
    'School-Culture',
    'Extracurriculars',
    'Surveillant-Attitude',
    'Teacher-Quality',
    'Class-Quality',
    'Club',
    'Location'
  ];

  return criteriaKeys.map(key => ({
    key,
    name: i18n.t(`schoolRatingCriteria.${key}.name`),
    description: i18n.t(`schoolRatingCriteria.${key}.description`),
    icon: i18n.t(`schoolRatingCriteria.${key}.icon`)
  }));
};