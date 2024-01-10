import Foundation
import Photos


@objc(Core)
class Core: NSObject {
  private var images: [[String: Any]] = [];
  private var options = PHContentEditingInputRequestOptions();
  
  @objc
  func getPhotos(_
                      resolve: RCTPromiseResolveBlock,
                      reject: RCTPromiseRejectBlock
  ) {
    let assets = PHAsset.fetchAssets(with: PHAssetMediaType.image, options: nil);
    self.options.isNetworkAccessAllowed = false;
    
    let group = DispatchGroup();

    assets.enumerateObjects {(object, _, _) in
      group.enter();
      
      let local_identifier = "ph://\(object.localIdentifier)";
      let fileName = PHAssetResource.assetResources(for: object)[0].originalFilename;
      
      object.requestContentEditingInput(with: self.options) {(editingInput, info) in
        let img = editingInput?.fullSizeImageURL;
        self.images.append([
          "local_identifier": local_identifier,
          "file_name": fileName,
          "url": img?.absoluteString ?? img?.baseURL,
          "width": object.pixelWidth,
          "height": object.pixelHeight,
        ]);
        
        group.leave();
      }
      
    }
    
//    group.notify(queue: .main) {
//      self.images.reverse();
//    }
    
    self.images.reverse();
    
    resolve(self.images);
  }
  
  // Override method
  @objc
  func requiresMainQueueSetup() -> Bool {
    return true;
  }
  
  @objc
  func constantsToExport() -> [String: Any]!{
    return ["initialCount": 0];
  }
  
}
