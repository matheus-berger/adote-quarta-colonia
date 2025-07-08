import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 

interface LayoutProps {
  children: React.ReactNode; // Permite que qualquer conteúdo React seja passado como children
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow"> {/* 'flex-grow' faz o conteúdo principal ocupar o espaço restante */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
