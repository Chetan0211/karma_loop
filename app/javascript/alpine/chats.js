document.addEventListener("alpine:init", () => {
  window.Alpine.data('chatAlpine', () => ({
    isAttachmentModalOpen: false,
    attachmentMenuOpen: false,
    showAttachmentMenu: false,
    showAttachmentData: null,
    showReplyBanner: false,
    isUploading: false,
    uploadProgress: 0,
    // { file, url, kind } for each file in the review modal
    attachments: [],
    previewIndex: null,
    caption: "",
    init() {
      this.$nextTick(() => {
        let video_input = document.getElementById("new_chat_attachments");
        video_input.addEventListener('direct-upload:initialize', () => {
          // this triggers after initialization
          this.isUploading = true;
        });

        video_input.addEventListener('direct-upload:start', () => {
        });

        video_input.addEventListener('direct-upload:progress', (e) => {
          this.uploadProgress = Math.round(e.detail.progress);
        });

        // Fires once every file has finished uploading, or after an upload error
        this.$refs.chat_form.addEventListener('direct-uploads:end', () => {
          this.closeAttachmentModal();
        });
      });
    },
    sendMessage() {
      // Send what is left in the review modal, so removed files are not uploaded
      const dataTransfer = new DataTransfer();
      for (let attachment of this.attachments) {
        dataTransfer.items.add(attachment.file);
      }
      this.$refs.chat_attachments.files = dataTransfer.files;
      this.$refs.messageInput.value = this.caption;
      this.caption = "";
      this.previewIndex = null;
      // Files are encrypted before the upload starts, so lock the modal straight away
      this.uploadProgress = 0;
      this.isUploading = true;
      this.$refs.chat_form_submit_button.click();
    },
    selectedAttachments(event) {
      if (!this.isAttachmentModalOpen) {
        // Carry over anything already typed in the chat box
        this.caption = this.$refs.messageInput.value;
      }
      for (let file of event.target.files) {
        this.attachments.push({ file: file, url: URL.createObjectURL(file), kind: this.attachmentKind(file) });
      }
      // Clear the picker so choosing the same file again still triggers a change
      event.target.value = "";
      this.isAttachmentModalOpen = true;
    },
    attachmentKind(file) {
      if (file.type.startsWith("image/")) return "image";
      if (file.type.startsWith("video/")) return "video";
      return "file";
    },
    removeAttachment(index) {
      URL.revokeObjectURL(this.attachments[index].url);
      this.attachments.splice(index, 1);
      this.previewIndex = null;
      if (this.attachments.length == 0) {
        this.closeAttachmentModal();
      }
    },
    closeAttachmentModal() {
      for (let attachment of this.attachments) {
        URL.revokeObjectURL(attachment.url);
      }
      this.attachments = [];
      this.previewIndex = null;
      this.caption = "";
      this.isAttachmentModalOpen = false;
      this.isUploading = false;
    }
  }));
});
