document.addEventListener('alpine:init', () => { 
  window.Alpine.data('header', () => ({
    activeTheme: localStorage.getItem('site_theme') || 'theme-purple',
    dark_mode: false,
    themes: {
      'theme-purple': { name: 'Versatile Purple (Default)', accent: 'bg-purple-600', accentHover: 'hover:bg-purple-700', text: 'text-purple-600', ring: 'ring-purple-500', focusRing: 'focus:ring-purple-500', swatchBg: 'bg-purple-600' },
      'theme-blue': { name: 'Vibrant Blue', accent: 'bg-blue-600', accentHover: 'hover:bg-blue-700', text: 'text-blue-600', ring: 'ring-blue-500', focusRing: 'focus:ring-blue-500', swatchBg: 'bg-blue-600' },
      'theme-green': { name: 'Balanced Green', accent: 'bg-green-600', accentHover: 'hover:bg-green-700', text: 'text-green-600', ring: 'ring-green-500', focusRing: 'focus:ring-green-500', swatchBg: 'bg-green-600' },
      'theme-cyan': { name: 'Bright Cyan', accent: 'bg-cyan-600', accentHover: 'hover:bg-cyan-700', text: 'text-cyan-600', ring: 'ring-cyan-500', focusRing: 'focus:ring-cyan-500', swatchBg: 'bg-cyan-600' },
      'theme-orange': { name: 'Energetic Orange', accent: 'bg-orange-600', accentHover: 'hover:bg-orange-700', text: 'text-orange-600', ring: 'ring-orange-500', focusRing: 'focus:ring-orange-500', swatchBg: 'bg-orange-600' },
      'theme-pink': { name: 'Accessible Rose', accent: 'bg-pink-600', accentHover: 'hover:bg-pink-700', text: 'text-pink-600', ring: 'ring-pink-500', focusRing: 'focus:ring-pink-500', swatchBg: 'bg-pink-600' }
    },
    init()
    {
      this.$nextTick(() => { 
        this.dark_mode= (localStorage.getItem('dark_mode') != null ? (localStorage.getItem('dark_mode') == 'dark' ? true : false) : (window.matchMedia('(prefers-color-scheme: dark)') ? true : false) );  
      });
    },
    change_dark_mode(event){
      if (event.target.checked){
      this.dark_mode = true;
      localStorage.setItem('dark_mode', 'dark');
      if(!document.documentElement.classList.contains('dark')){
      document.documentElement.classList.add('dark')
      }
      document.documentElement.classList.remove('light')
      }
      else{
      localStorage.setItem('dark_mode', 'light');
      this.dark_mode = false;
      if(!document.documentElement.classList.contains('light')){
      document.documentElement.classList.add('light')
      }
      document.documentElement.classList.remove('dark')
      }
    },
    setTheme(themeKey) {
      localStorage.setItem('site_theme', themeKey);
      
      Object.keys(this.themes).forEach((key) => {
        document.documentElement.classList.remove(key);
      });
      document.documentElement.classList.add(themeKey);
      this.activeTheme = themeKey;
    },
  }));
});