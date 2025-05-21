document.addEventListener('alpine:init', () => { 
  window.Alpine.data('post_new', () => ({
    postType: 'blog',
    imageFiles: [],
    videoFile: null,
    imageUploadInputRef: null,
    image_error_message: null,
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