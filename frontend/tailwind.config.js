/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#EDF1F7",
        blue: '#4154F1',
        darkBlue: '#012970',
        gray: '#6C757D',
        pink: '#FF4170',
        purple: '#F6F6FE',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'header': '0px 4px 20px 2px rgba(0, 0, 0, 0.03)',
        'sidebar': '0px 0px 20px 0px rgba(0, 0, 0, 0.03)',
        'element': '0px 0px 30px 0px rgba(1, 41, 112, 0.1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
