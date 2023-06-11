import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormState {
  name: string;
  surname: string;
  address: string;
  facePic: File | null;
  idPic: File | null;
}

const initialFormState: FormState = {
  name: '',
  surname: '',
  address: '',
  facePic: null,
  idPic: null,
};

// todo: protected page if not connected

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'facePic' | 'idPic',
  ) => {
    setFormState({
      ...formState,
      [type]: e.target.files ? e.target.files[0] : null,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/kyc/register`,
        formState,
        {
          headers: {
            'content-type': 'application/json',
          },
          withCredentials: true,
        },
      );
    } catch {
      navigate('/');
    }
  };

  return (
    <div>
      <Navbar lightText={false} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5">Register</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <form onSubmit={handleSubmit}>
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Surname *
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formState.surname}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formState.address}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Picture of your face *
                </label>
                <input
                  type="file"
                  name="facePic"
                  onChange={(e) => handleFileChange(e, 'facePic')}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 
                block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Picture of your ID *
                </label>
                <input
                  type="file"
                  name="idPic"
                  onChange={(e) => handleFileChange(e, 'idPic')}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  required
                />

                <button
                  type="submit"
                  className="transition duration-200 bg-blue-500 hover:bg-blue-600 rounded-lg text-white w-full py-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
