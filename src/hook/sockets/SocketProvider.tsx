import {useAppSelector} from 'app-redux/store';
import {ReactNode, useEffect} from 'react';
import SocketManager from './SocketManager';

interface Props {
  children: ReactNode;
}

const SocketProvider = ({children}: Props) => {
  const {token} = useAppSelector(state => state.logicSlice);
  const socket = SocketManager.getInstance();

  useEffect(() => {
    if (token) {
      socket.authenticate(token);
    }
  }, [token]);

  return <>{children}</>;
};

export default SocketProvider;
