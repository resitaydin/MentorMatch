import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function Login() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }

    console.log('Login with:', { email, password });
    // Call your backend API here for login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600"
        >
          Log In
        </button>

        <p className="mt-4 text-center">
          Don't have an account? 
          <button 
            onClick={() => navigate('/register')} // Use navigate to go to the register page
            className="text-blue-500 underline ml-1"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
