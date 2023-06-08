import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {apiUploadFile} from 'api/discovery';
import ImagePicker from 'react-native-image-crop-picker';
import I18Next from 'utility/I18Next';
import {checkCamera, checkPhoto} from './permission/permission';
import {checkIsVideo} from './validate';
import RNFetchBlob from 'rn-fetch-blob';

const MAX_WIDTH = 1500;
const MAX_HEIGHT = 1500;

export interface ImagePickerParamsType {
  crop?: boolean;
  freeStyleCrop?: boolean;
  maxFiles?: number;
  maxWidth?: number;
  maxHeight?: number;
}

// export interface TypeImagePicker {
//   maxWidth?: number;
//   maxHeight?: number;
//   includeBase64?: boolean;
//   quality?: PhotoQuality;
// }

interface ImageReadLibraryType {
  first: number;
  after: string | undefined;
}

const ImageUploader = {
  pickCamera: async (params?: ImagePickerParamsType) => {
    const check = await checkCamera();
    if (check) {
      const res = await ImagePicker.openCamera({
        mediaType: 'photo',
        width: params?.maxWidth || MAX_WIDTH,
        height: params?.maxHeight || MAX_HEIGHT,
        waitAnimationEnd: true,
        cropping: params?.crop === undefined ? true : params?.crop,
        freeStyleCropEnabled: params?.freeStyleCrop || false,
        cropperChooseText: I18Next.t('common.imageUpload.selected'),
        cropperCancelText: I18Next.t('common.imageUpload.cancel'),
        compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
        compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
        compressImageQuality: 1,
      });
      return res;
    }
    throw new Error('Error while check camera');
  },
  pickLibrary: async (params?: ImagePickerParamsType) => {
    const check = await checkPhoto();
    if (check) {
      const res = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: params?.maxWidth || MAX_WIDTH,
        height: params?.maxHeight || MAX_HEIGHT,
        waitAnimationEnd: true,
        cropping: params?.crop === undefined ? true : params?.crop,
        freeStyleCropEnabled: params?.freeStyleCrop || false,
        cropperChooseText: I18Next.t('common.imageUpload.selected'),
        cropperCancelText: I18Next.t('common.imageUpload.cancel'),
        compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
        compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
        compressImageQuality: 1,
      });
      return res;
    }
    throw new Error('Error while read image from library');
  },
  pickMultipleLibrary: async (params?: ImagePickerParamsType) => {
    const check = await checkPhoto();
    if (check) {
      const res = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: params?.maxWidth || MAX_WIDTH,
        height: params?.maxHeight || MAX_HEIGHT,
        waitAnimationEnd: true,
        cropping: params?.crop === undefined ? true : params?.crop,
        freeStyleCropEnabled: params?.freeStyleCrop || false,
        cropperChooseText: I18Next.t('common.imageUpload.selected'),
        cropperCancelText: I18Next.t('common.imageUpload.cancel'),
        compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
        compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
        compressImageQuality: 1,
        multiple: true,
        maxFiles: params?.maxFiles ?? 5,
      });
      return res.map(item => item?.path);
    }
    throw new Error('Error while read image from library');
  },
  pickVideo: async () => {
    const check = await checkPhoto();
    if (check) {
      const res = await ImagePicker.openPicker({
        mediaType: 'video',
        maxFiles: 1,
      });
      return res?.path;
    }
    throw new Error('Error while read video from library');
  },
  convertUrlToBase64: async (url: string) => {
    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', url);
    const base64Data: string = await resp?.readFile('base64');
    await RNFetchBlob.fs.unlink(resp?.path());
    return `data:image/png;base64,${base64Data}`;
  },

  readImageFromLibrary: async (params: ImageReadLibraryType) => {
    await checkPhoto();

    const res = await CameraRoll.getPhotos({
      first: params.first,
      after: params?.after,
      assetType: 'Photos',
      include: ['filename', 'fileSize', 'imageSize', 'orientation'],
    });
    return res;
  },

  upLoad: async (path: string, quality: number | undefined = undefined) => {
    const payload = new FormData();
    const formatImage = {
      uri: path,
      // type: 'image/jpeg',
      name: 'file',
    };
    payload.append('file', formatImage);
    const uriImg = await apiUploadFile({
      formData: payload,
      quality,
      timeout: checkIsVideo(path) ? 60000 : 10000,
    });
    if (uriImg?.data?.length > 0) {
      return uriImg?.data[0];
    }
    return null;
  },

  upLoadManyImg: async (
    arrPath: Array<string>,
    quality: number | undefined = undefined,
  ): Promise<Array<string>> => {
    const payload = new FormData();
    let timeout = 0;
    arrPath.forEach((path: any) => {
      const formatImage: any = {
        uri: path,
        // type: 'image/jpeg',
        name: 'file',
      };
      payload.append('file', formatImage);
      if (checkIsVideo(path)) {
        timeout += 60000;
      } else {
        timeout += 10000;
      }
    });
    const uriImg = await apiUploadFile({
      formData: payload,
      quality,
      timeout,
    });
    if (uriImg?.data.length > 0) {
      return uriImg?.data;
    }
    return [];
  },
};

export default ImageUploader;
