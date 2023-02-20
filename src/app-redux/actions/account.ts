import dayjs from 'dayjs';
import {accountSliceAction, initialAccountState} from '../account/accountSlice';
import Store, {RootState} from '../store';
import {setIsLogOut, setToken, updateListChatTag} from './logic';

type PassportType = Partial<RootState['accountSlice']['passport']>;

export const updatePassport = (newProfile: PassportType) => {
  const current = Store.getState().accountSlice.passport;
  const tempBirthday = newProfile.information?.birthday;

  const temp: PassportType = {
    profile: {...current.profile, ...newProfile.profile},
    information: {
      ...current.information,
      ...newProfile.information,
      birthday: tempBirthday
        ? String(dayjs(tempBirthday))
        : current.information.birthday,
    },
    setting: {...current.setting, ...newProfile.setting},
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
  setModeExp(false);
  updatePassport({
    information: passport.information,
    profile: passport.profile,
  });
  updateListChatTag([]);
  setIsLogOut(true);
};
