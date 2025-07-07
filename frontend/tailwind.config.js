export default {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}', // ✅ Ensure this matches your structure
      "./src/components/**/*.{js,ts,jsx,tsx}",
      
    ],
    theme: {
      extend: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
          },
        colors: {
          primary: '#003366',
          accent: '#E3D9FF',
        },
      },
    },
    plugins: [],
  };
  