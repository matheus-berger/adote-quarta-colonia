import './index.css'; // Garanta que o index.css está sendo importado

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">
          Adote Quarta Colônia
        </h1>
        <p className="text-gray-700 text-lg">
          Tailwind CSS configurado com sucesso!
        </p>
        <button className="mt-6 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300">
          Ver Animais
        </button>
      </div>
    </div>
  );
}

export default App;
