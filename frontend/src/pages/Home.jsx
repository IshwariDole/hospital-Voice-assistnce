const Home = () => {
  return (
    <div className="text-center mt-20">
      <h2 className="text-4xl font-bold text-blue-700">
        Welcome to AI Hospital Assistant 🏥
      </h2>

      <p className="mt-6 text-lg text-gray-600">
        Book appointments, chat with AI doctor and manage your health easily.
      </p>

      <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Start Chat
      </button>
    </div>
  );
};

export default Home;