import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Adote Quarta Colônia. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Feito com ❤️ para os animais da Quarta Colônia, RS.</p>
      </div>
    </footer>
  );
};

export default Footer;
