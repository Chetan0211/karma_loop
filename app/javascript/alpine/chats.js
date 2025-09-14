document.addEventListener("alpine:init", () => {
  window.Alpine.data('chatAlpine', () => ({
    isAttachmentModalOpen: false,
    attachmentMenuOpen: false,
    showAttachmentMenu: false,
    showAttachmentData: null,
    showReplyBanner: false,
    isUploading: false,
    uploadProgress: 0,
    attachments: [],
    init() {
      this.$nextTick(() => {
        let video_input = document.getElementById("new_chat_attachments");
        video_input.addEventListener('direct-upload:initialize', () => {
          // this triggers after initialization
          this.isUploading = true;
        });

        video_input.addEventListener('direct-upload:start', () => {
        });

        video_input.addEventListener('direct-upload:end', () => {
          this.isAttachmentModalOpen = false;
          this.attachments = [];
          this.isUploading = false;
        });

        video_input.addEventListener('direct-upload:error', () => {
          this.isAttachmentModalOpen = false;
          this.attachments = [];
          this.isUploading = false;
        });

        video_input.addEventListener('direct-upload:progress', (e) => {
          this.uploadProgress = Math.round(e.detail.progress);
        });
      });
    },
    sendMessage() {
      const dataTransfer = new DataTransfer();
      for (let file of this.$refs.imageInput.files) {
        dataTransfer.items.add(file);
      }
      for (let file of this.$refs.videoInput.files) {
        dataTransfer.items.add(file);
      }
      for (let file of this.$refs.documentInput.files) {
        dataTransfer.items.add(file);
      }
      this.$refs.chat_attachments.files = dataTransfer.files;
      this.$refs.chat_form_submit_button.click();
    },
    selectedAttachments(event) {
      for (let file of event.target.files) {
        this.attachments.push(file);
      }
      this.isAttachmentModalOpen = true;
    },
    removeAttachment(index) {
      this.attachments.splice(index, 1);
    }
  }));
});