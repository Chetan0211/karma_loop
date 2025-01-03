import { Controller } from "@hotwired/stimulus"
import Cropper from "cropperjs";

// Connects to data-controller="user--profile"
export default class extends Controller {
  connect() {

    const upload_picture = document.getElementById('upload_picture');
    const close_crop = document.getElementById('close_crop');
    const fileInput = document.getElementById("profile_picture_input");
    const previewImage = document.getElementById("preview_image");
    const update_picture = document.getElementById("update_picture");
    const remove_picture = document.getElementById("remove_picture");
    const upload_cropped_image = document.getElementById("upload_cropped_image");
    const noti = document.getElementById('noti');
    const profile_image = document.getElementById('profile_image');
    const edit_password = document.getElementById('edit_password');
    const edit_password_form = document.getElementById('edit_password_form');
    const cancel_update_password = document.getElementById('cancel_update_password');

    const profile_pic_container = document.getElementById('profile_picture_section');
    const upload_picture_section = document.getElementById('upload_picture_section');
    let cropper;
    
    upload_picture.addEventListener('click', (event) => {
      fileInput.click();
    });

    update_picture.addEventListener('click', (event) => { 
      fileInput.click();
    });

    close_crop.addEventListener('click', (event) => {
      noti.style.display = 'none';

    });

    edit_password.addEventListener('click', (event) => {
      edit_password.style.display = 'none';
      edit_password_form.reset();
      edit_password_form.style.display = 'block';
    });

    edit_password_form.addEventListener('submit', (event) => {
      edit_password.style.display = 'block';
      edit_password_form.style.display = 'none';
    });

    cancel_update_password.addEventListener('click', (event) => {
      edit_password.style.display = 'block';
      edit_password_form.style.display = 'none';
     });

    upload_cropped_image.addEventListener('click', (event) => {
      noti.style.display = 'none';
      profile_pic_container.style.display = 'block';
      upload_picture_section.style.display = 'none';

      let croppedCanvas = cropper.getCroppedCanvas();

      profile_image.src = croppedCanvas.toDataURL('image/jpg');
    });

    remove_picture.addEventListener('click', (event) => {
      profile_pic_container.style.display = 'none';
      upload_picture_section.style.display = 'block';
      profile_image.src = "";
     });

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          noti.style.display = 'flex';

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
