import { useSelector } from 'react-redux';
import translations from '../utils/translations';

export default function useTranslation() {
  const language = useSelector((state) => state.language);
  return (key) => translations[language]?.[key] || key;
}
