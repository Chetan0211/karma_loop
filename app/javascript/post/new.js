document.addEventListener('alpine:init', () => { 
  window.Alpine.data('post_new', () => ({
    postType: 'blog',
    imageFiles: [],
    videoFile: null,
    imageUploadInputRef: null,
    image_error_message: null,
    isVideoUploading: false,
    button_disable: false,
    videoUploadProgress: 0,
    init() {
      this.$nextTick(() => { 
        let video_input = document.getElementById("post_video");
        video_input.addEventListener('direct-upload:initialize', () => {
          // this triggers after initialization
        });
      
        video_input.addEventListener('direct-upload:start', () => {
          this.button_disable = true;
          this.isVideoUploading = true;
        });
      
        video_input.addEventListener('direct-upload:finish', () => {
          this.button_disable = false;
          this.isVideoUploading = false;
        });
      
        video_input.addEventListener('direct-upload:error', () => {
          this.button_disable = false;
          this.isVideoUploading = false;
        });
      
        video_input.addEventListener('direct-upload:progress', (e) => {
          this.videoUploadProgress = Math.round(e.detail.progress);
        });
      });
    },
    submit_post() {
      const dataTransfer = new DataTransfer();
      this.imageFiles.forEach(element => {
        dataTransfer.items.add(element);
        this.$refs.imageUploadInputRef.files = dataTransfer.files;
      });
    }
  }));
});