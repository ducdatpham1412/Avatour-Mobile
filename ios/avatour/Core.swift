import Foundation
import Photos


@objc(Core)
class Core: NSObject {
  private var images = [[String: Any]]();
  
  @objc
  func getPhotos(_
                      resolve: RCTPromiseResolveBlock,
                      reject: RCTPromiseRejectBlock
  ) {
    let assets = PHAsset.fetchAssets(with: PHAssetMediaType.image, options: nil);

    assets.enumerateObjects {(object, _, _) in
      let uri = "ph://\(object.localIdentifier)";
      let fileName = PHAssetResource.assetResources(for: object)[0].originalFilename;
      self.images.append([
        "url": "\(uri)/\(fileName)",
        "width": object.pixelWidth,
        "height": object.pixelHeight,
      ]);
//      object.requestContentEditingInput(with: PHContentEditingInputRequestOptions()) { (eidtingInput, info) in
//        if let input = eidtingInput, let imgURL = input.fullSizeImageURL {
//          print("Img url \(imgURL)");
//        }
//      }
    }
    
    self.images.reverse();
    
    resolve(self.images);
  }
  
  // Overide method
  @objc
  func requiresMainQueueSetup() -> Bool {
    return true;
  }
  
  @objc
  func constantsToExport() -> [String: Any]!{
    return ["initialCount": 0];
  }
  
}
