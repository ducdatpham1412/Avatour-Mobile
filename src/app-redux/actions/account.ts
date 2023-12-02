import dayjs from 'dayjs';
import {accountSliceAction, initialAccountState} from '../account/accountSlice';
import Store, {RootState} from '../store';
import {setNewNotifications, setToken} from './logic';

type PassportType = DeepPartial<RootState['accountSlice']['passport']>;

export const updatePassport = (newPassport: PassportType) => {
  const current = Store.getState().accountSlice.passport;
  const tempBirthday = newPassport.profile?.birthday;

  const temp: PassportType = {
    profile: {
      ...current.profile,
      ...newPassport.profile,
      information: {
        ...current.profile.information,
        ...newPassport?.profile?.information,
      },
      birthday: tempBirthday
        ? String(dayjs(tempBirthday))
        : current.profile.birthday,
    },
  };

  Store.dispatch(accountSliceAction.updatePassport(temp));
};

export const setModeExp = (value: boolean) => {
  Store.dispatch(accountSliceAction.setModeExp(value));
};

export const logOut = () => {
  const {passport} = initialAccountState;

  // Set modeExp can not set here, cuz it make row choose socket
  // of MessScreen render again while it's unmounting -> CRASH APP
  // Instead we will set when press button in Login or ChoosingLoginOrEnjoy
  // Redux.setModeExp(true);

  setToken(null);
  setModeExp(true);
  updatePassport({
    profile: passport.profile,
  });
  setNewNotifications(0);
};
