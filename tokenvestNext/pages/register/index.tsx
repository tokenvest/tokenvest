import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useRouter } from "next/router";

interface FormState {
  name: string;
  surname: string;
  address: string;
  facePic: File | null;
  idPic: File | null;
}

const initialFormState: FormState = {
  name: "",
  surname: "",
  address: "",
  facePic: null,
  idPic: null,
};

// todo: protected page if not connected

const Register: React.FC = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "facePic" | "idPic"
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
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch {
      router.push("/");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5">Register</h1>
          <div className=" card card-compact w-96  bg-gray-900 shadow-xl ">
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
                  className="input input-bordered w-full max-w-xs mb-5"
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
                  className="input input-bordered w-full max-w-xs mb-5"
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
                  className="input input-bordered w-full max-w-xs mb-5"
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Picture of your face *
                </label>
                <input
                  type="file"
                  name="facePic"
                  onChange={(e) => handleFileChange(e, "facePic")}
                  className="file-input w-full max-w-xs "
                  required
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block mt-5">
                  Picture of your ID *
                </label>
                <input
                  type="file"
                  name="idPic"
                  onChange={(e) => handleFileChange(e, "idPic")}
                  className="file-input w-full max-w-xs "
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 rounded-full font-semibold text-sm mt-5"
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
