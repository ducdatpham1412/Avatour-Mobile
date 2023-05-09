if [ ./react-native-image-zoom-viewer/built/image-viewer.component.js ]; then
    cp ./react-native-image-zoom-viewer/built/image-viewer.component.js ../node_modules/react-native-image-zoom-viewer/built/image-viewer.component.js
fi

if [ ./react-native-actionsheet/lib/ActionSheetCustom.js ]; then
    cp ./react-native-actionsheet/lib/ActionSheetCustom.js ../node_modules/react-native-actionsheet/lib/ActionSheetCustom.js
fi

# if [ ./react-native-config/react-native-config.podspec ]; then
#     cp ./react-native-config/react-native-config.podspec ../node_modules/react-native-config/react-native-config.podspec
# fi

if [ ./react-native-video-controls/VideoPlayer.js ]; then
    cp ./react-native-video-controls/VideoPlayer.js ../node_modules/react-native-video-controls/VideoPlayer.js
fi

if [ ./react-native-video-controls/assets/img/no_volume.png ]; then
    cp ./react-native-video-controls/assets/img/no_volume.png ../node_modules/react-native-video-controls/assets/img/no_volume.png
fi
if [ ./react-native-video-controls/assets/img/no_volume@2x.png ]; then
    cp ./react-native-video-controls/assets/img/no_volume@2x.png ../node_modules/react-native-video-controls/assets/img/no_volume@2x.png
fi
if [ ./react-native-video-controls/assets/img/no_volume@3x.png ]; then
    cp ./react-native-video-controls/assets/img/no_volume@3x.png ../node_modules/react-native-video-controls/assets/img/no_volume@3x.png
fi

if [ ./react-native-size-matters/scaling-utils.js ]; then
  cp ./react-native-size-matters/scaling-utils.js ../node_modules/react-native-size-matters/lib/scaling-utils.js
fi

# React-native-tab-view
if [ ./react-native-tab-view ]; then
    cp ./react-native-tab-view/lib/typescript/src/TabView.d.ts ../node_modules/react-native-tab-view/lib/typescript/src/TabView.d.ts;
    cp ./react-native-tab-view/src/PageViewAdapter.tsx ../node_modules/react-native-tab-view/src/PageViewAdapter.tsx;
    cp ./react-native-tab-view/src/PanResponderAdapter.tsx ../node_modules/react-native-tab-view/src/PanResponderAdapter.tsx;
    cp ./react-native-tab-view/src/TabView.tsx ../node_modules/react-native-tab-view/src/TabView.tsx;
    cp ./react-native-tab-view/src/PagerViewAdapter.tsx ../node_modules/react-native-tab-view/src/PagerViewAdapter.tsx;
fi


# For create chosen env
if [ ! -f ../src/asset/env/env.chosen.ts ]; then
    echo 'Config env 👷'
    cd ../src/asset/env && touch env.chosen.ts && : > env.chosen.ts && echo "export const ChosenEnv: 'dev' | 'staging' | 'pro' = 'dev';\n // Choose 1 of 3 env: 'dev' | 'staging' | 'pro" >> env.chosen.ts && touch config.dev.ts && config config.prod.ts 
fi;
if [ ! -f ../src/asset/env/config.dev.ts ]; then
    touch config.dev.ts && cat config.template.ts > config.dev.ts
fi;
if [ ! -f ../src/asset/env/config.prod.ts ]; then
    touch config.prod.ts && cat config.template.ts > config.prod.ts
fi;