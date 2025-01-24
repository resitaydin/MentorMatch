import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

type Role = 'user' | 'mentor';

export default function Register() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [role, setRole] = useState<Role>('user');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    gender: '',
    domain: '',
    price: '',
    email: '',
    location: '',
    phone: '',
    overview: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields: (keyof typeof formData)[] = role === 'mentor' 
      ? ['firstname', 'lastname', 'age', 'gender', 'domain', 'price', 'email', 'location', 'phone', 'overview']
      : ['firstname', 'lastname', 'email'];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the required fields: ${missingFields.join(', ')}`);
      return;
    }

    console.log('Register with:', { role, ...formData });
    // Call your backend API here for register
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstname' | 'lastname') => {
    const value = e.target.value;
    // Ensure only alphabet characters
    if (/^[a-zA-Z]*$/.test(value)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <div className="flex gap-4 mb-6 justify-center">
  <button 
    onClick={() => setRole('user')} 
    className={`py-2 px-8 text-lg uppercase font-bold rounded-md ${role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  >
    User
  </button>

  <button 
    onClick={() => setRole('mentor')} 
    className={`py-2 px-8 text-lg uppercase font-bold rounded-md ${role === 'mentor' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  >
    Mentor
  </button>
</div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="firstname" 
            placeholder="First Name" 
            value={formData.firstname} 
            onChange={(e) => handleNameChange(e, 'firstname')} 
            className="w-full p-3 mb-4 border rounded-md" 
            required 
          />
          <input 
            name="lastname" 
            placeholder="Last Name" 
            value={formData.lastname} 
            onChange={(e) => handleNameChange(e, 'lastname')} 
            className="w-full p-3 mb-4 border rounded-md" 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 mb-4 border rounded-md" 
            required 
          />

          {role === 'mentor' && (
            <>
              <div className="flex gap-4 mb-4">
                <input 
                  name="age" 
                  type="number" 
                  placeholder="Age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  className="w-1/3 p-3 border rounded-md" 
                  required 
                />
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-1/3 p-3 border rounded-md" 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
                <input 
                  name="price" 
                  type="number" 
                  placeholder="Hourly Rate ($)" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="w-1/3 p-3 border rounded-md" 
                  required 
                />
              </div>
              <input 
                name="domain" 
                placeholder="Domain" 
                value={formData.domain} 
                onChange={handleChange} 
                className="w-full p-3 mb-4 border rounded-md" 
                required 
              />
              <input 
                name="location" 
                placeholder="Location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full p-3 mb-4 border rounded-md" 
                required 
              />
              <input 
                name="phone" 
                placeholder="Phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full p-3 mb-4 border rounded-md" 
                required 
              />
              <textarea 
                name="overview" 
                placeholder="Overview" 
                value={formData.overview} 
                onChange={handleChange} 
                rows={5} 
                className="w-full p-3 mb-4 border rounded-md" 
                required 
              />
            </>
          )}

          <button 
            type="submit" 
            className="bg-blue-500 text-white py-3 px-4 rounded-md w-full hover:bg-blue-600"
          >
            Register
          </button>

          <p className="mt-4 text-center">
            Already have an account? 
            <button 
              onClick={() => navigate('/login')} // Use navigate to go to the login page
              className="text-blue-500 underline ml-1"
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
