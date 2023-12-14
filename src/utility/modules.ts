import {NativeModules} from 'react-native';

interface CoreInterface {
  getPhotos: () => Promise<LibraryImage[]>;
}

const Core = NativeModules.Core as CoreInterface;

export {Core};
