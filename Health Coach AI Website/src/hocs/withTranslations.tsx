// src/hocs/withTranslations.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const withTranslations = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { i18n } = useTranslation();
    
    useEffect(() => {
      // Ensure translations are loaded
      if (!i18n.isInitialized) {
        i18n.init();
      }
    }, [i18n]);

    return <WrappedComponent {...props} />;
  };
};

export default withTranslations;