import { Controller } from "@hotwired/stimulus"
import Cropper from "cropperjs";
import { parentLikeToggle } from "../../helpers/post_helper";

// Connects to data-controller="user--profile"
export default class extends Controller {
  connect() {
    parentLikeToggle();
    const fileInput = document.getElementById("edit_profile_profile_picture");
    const previewImage = document.getElementById("preview_image");
    const update_picture = document.getElementById("update_picture");
    const remove_picture = document.getElementById("remove_picture");
    const upload_cropped_image = document.getElementById("upload_cropped_image_button");
    const profile_image = document.getElementById('profile_image_preview');
    const main_profile_picture = document.getElementById('main_profile_picture');
    let cropper;
    update_picture.addEventListener('click', (event) => { 
      fileInput.click();
    });

    upload_cropped_image.addEventListener('click', (event) => {
      let croppedCanvas = cropper.getCroppedCanvas();
      profile_image.src = croppedCanvas.toDataURL('image/jpg');
    });

    remove_picture.addEventListener('click', (event) => {
      profile_image.src = "";
    });

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;

          if (cropper) cropper.destroy();
          cropper = new Cropper(previewImage, {
            autoCropArea: 1,
            aspectRatio: 1, // Crop into square
            viewMode: 2,
            crop(event) {
              document.getElementById("crop_x").value = Math.round(event.detail.x);
              document.getElementById("crop_y").value = Math.round(event.detail.y);
              document.getElementById("crop_size").value = Math.round(event.detail.width);
            },
          });
        }
        reader.readAsDataURL(file);
      }
    });
  }
}
