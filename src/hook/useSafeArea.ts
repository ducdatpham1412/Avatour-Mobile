import {safePaddingNotZero} from 'asset/metrics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isIOS} from 'utility/assistant';

const useSafeArea = () => {
  const {bottom, top, right, left} = useSafeAreaInsets();

  return {
    top,
    bottom: isIOS
      ? bottom + safePaddingNotZero
      : bottom + 2 * safePaddingNotZero,
    right,
    left,
  };
};

export default useSafeArea;
