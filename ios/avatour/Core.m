#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Core, NSObject)

RCT_EXTERN_METHOD(getPhotos:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  );

@end
