import './globals.css';

export const metadata = {
  title: 'Elixa — Learn AI & ML',
  description: 'An interactive AI & Machine Learning learning platform with hands-on coding, mini-games, quizzes, and real-world simulations.',
  keywords: 'AI, Machine Learning, Deep Learning, Interactive Learning, Python, Neural Networks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>{children}</body>
    </html>
  );
}
