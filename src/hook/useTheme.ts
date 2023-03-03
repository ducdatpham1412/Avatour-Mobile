import Theme from 'asset/theme/Theme';

const useTheme = () => {
  return {
    ...Theme.lightTheme,
    ...Theme.newTheme,
  };
};

export default useTheme;
