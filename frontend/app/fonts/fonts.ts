import localFont from 'next/font/local';

export const sansation = localFont({
  src: [
    {
      path: './Sansation-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './Sansation-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Sansation-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Sansation-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './Sansation-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Sansation-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-sansation',
}); 