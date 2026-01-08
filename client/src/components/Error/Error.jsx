import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

function Error({ statusCode = 404, message = "Something went wrong" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-themedark p-4 md:p-8">
      <div className="max-w-md w-full rounded-xl dark:text-white p-6 md:p-8 text-center">
        <div className="text-[red] text-6xl mb-4">
          <FaExclamationTriangle className="mx-auto" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-[red] mb-4">{statusCode}</h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold  mb-4">{message}</h2>
        
        <p className="text-gray-500 mb-8">
          We're sorry, but something went wrong. The page you're looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-themegreen text-themegreen font-semibold rounded-lg hover:bg-themegreen hover:bg-opacity-10 hover:text-white cursor-pointer transition-all duration-300 active:scale-95"
          >
            <FaArrowLeft /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-themegreen text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <FaHome /> Home Page
          </button>
        </div>
        
        
      </div>
    </div>
  );
}

export default Error;
