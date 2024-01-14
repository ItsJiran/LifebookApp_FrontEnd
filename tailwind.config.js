/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	"./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    colors:{
      'white':'#ffffff',
      'blue-light':{
        100:'rgba(163, 189, 235, 0.50)',
      },
      'blue':{
        100:'#f1f8ff',
        200:'#a3bdeb',
        300:'#7FA5EB',
        400:'#5185e4',
      },
      'blue-dark':{
        100:'#9aa5c2',
        200:'#516785',
        300:'#3f5675',
        400:'#314765',
      },
      'black':{
        100:'#C9C9C9',
        200:'#7D8390',
        300:'#454A55',
        400:'#232428',
      },
      'red':{
        100:'#F6C6D2',
        200:'#FFA6BC',
        300:'#ED8CA4',
        400:'#DE6784',
        500:'#B44862',
      },
      'yellow':{
        200:'#FFEBA6',
        400:'#D4BC65',
        500:'#BAA24B',
      },
      'green':{
        200:'#BDFFA6',
        400:'#86DE67',
      },
    },
    fontFamily:{
      'sans' : ['Poppins'],
      'serif' : ['Poppins'],
    },
    fontSize:{
      sm: '0.88rem',
      '1sm' : '0.8rem',
      '2sm' : '0.7rem',
      '3sm' : '0.6rem',
      base: '1rem',
      md:'1.1rem',
      lg: '1.25rem',
      xl: '1.3rem',
      '2xl': '1.35rem',
      '3xl': '1.4rem',
      '4xl': '1.45rem',
    },
    extend: {
      zIndex:{
        '-1':'-1',
      },
      boxShadow:{
        'top-nav':'0px -3px 13px rgba(209, 218, 235, 0.50)',
      }
    },
  },
  plugins: [],
}

