document.addEventListener("alpine:init", () => {
  window.Alpine.data("passwordReset", () => ({
    secureKey: '',
    skip: false,
    formatKey(e) {
      let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toUpperCase();
      val = val.replace(/(.{4})/g, '$1-').replace(/-$/, '');
      this.secureKey = val;
    }
  }));
});