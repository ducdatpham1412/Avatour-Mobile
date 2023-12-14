import {NativeModules} from 'react-native';

it('test', () => {
  NativeModules.Counter.populatePhotos()
    .then((res: any) => {
      console.log('Resonse photos are: ', res);
    })
    .catch((err: any) => {
      console.log('Error hehe: ', err);
    });
});
