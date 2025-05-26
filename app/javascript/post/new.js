document.addEventListener('alpine:init', () => { 
  window.Alpine.data('post_new', () => ({
    postType: 'blog',
    imageFiles: [],
    videoFile: null,
    imageUploadInputRef: null,
    image_error_message: null,
    videoFile: null,
    submit_post(){
      const dataTransfer = new DataTransfer();
      this.imageFiles.forEach(element => {
        dataTransfer.items.add(element);
        this.$refs.imageUploadInputRef.files = dataTransfer.files;
      });
      console.log(dataTransfer.files.length);
    }
  }));
});

document.addEventListener('turbo:load', () => {
  let video_input = document.getElementById("post_video");

  video_input.addEventListener('change', ()=>{
    console.log("input changed")
  });

  video_input.addEventListener('direct-upload:initialize', () => {
    console.log("upload initialized")
  });

  video_input.addEventListener('direct-upload:start', () => {
    console.log("upload started")
  });

  video_input.addEventListener('direct-upload:finish', () => {
    console.log("upload finished")
  });

  video_input.addEventListener('direct-upload:error', () => {
    console.log("upload error")
  });

  video_input.addEventListener('direct-upload:progress', (e) => {
    console.log(e.detail.progress)
  });
});