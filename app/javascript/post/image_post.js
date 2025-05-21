document.addEventListener('alpine:init', () => { 
  window.Alpine.data('carousel', (count = 1) => ({
    postType: 'blog',
    currentImageIndex: 0,
    imageCount: count,
    prevPost() {
      if(this.currentImageIndex-1 >= 0){
        this.currentImageIndex--;
        this.$refs.carouselTrack.style.transform = `translateX(-${this.currentImageIndex * 100}%)`;
      }
    },
    nextPost() {
      if(this.currentImageIndex+1 < this.imageCount){
        this.currentImageIndex++;
        this.$refs.carouselTrack.style.transform = `translateX(-${this.currentImageIndex * 100}%)`;
      }
    },
    dotClick(index) {
      this.currentImageIndex = index;
      this.$refs.carouselTrack.style.transform = `translateX(-${this.currentImageIndex * 100}%)`;
    }
  }));
});