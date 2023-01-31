import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {apiUploadFile} from 'api/module';
import ImagePicker from 'react-native-image-crop-picker';
import I18Next from 'utility/I18Next';
import {checkPhoto} from './permission/permission';
import {checkIsVideo} from './validate';

const MAX_WIDTH = 1500;
const MAX_HEIGHT = 1500;

export interface ImagePickerParamsType {
    crop?: boolean;
    freeStyleCrop?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    maxWidth?: number;
    maxHeight?: number;
}

interface ImageReadLibraryType {
    first: number;
    after: string | undefined;
}

const ImageUploader = {
    chooseImageFromCamera: (params?: ImagePickerParamsType) =>
        ImagePicker.openCamera({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop === undefined ? true : params?.crop,
            freeStyleCropEnabled: params?.freeStyleCrop || false,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
            compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
            compressImageQuality: 1,
        }),
    chooseImageFromLibrary: (params?: ImagePickerParamsType) =>
        ImagePicker.openPicker({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop === undefined ? true : params?.crop,
            freeStyleCropEnabled: params?.freeStyleCrop || false,
            maxFiles: params?.maxFiles || 1,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
            compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
            compressImageQuality: 1,
        }),
    chooseVideoFromLibrary: () =>
        ImagePicker.openPicker({
            mediaType: 'video',
            maxFiles: 1,
        }),

    readImageFromLibrary: async (params: ImageReadLibraryType) => {
        await checkPhoto();

        const res = await CameraRoll.getPhotos({
            first: params.first,
            after: params?.after,
            assetType: 'Photos',
            include: ['filename'],
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
