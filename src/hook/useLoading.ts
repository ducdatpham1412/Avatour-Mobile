import {useState} from 'react';

const useLoading = (init?: boolean) => {
  const [loading, setLoading] = useState(init ?? false);
  return {loading, setLoading};
};

export default useLoading;
