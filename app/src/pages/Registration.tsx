import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import icons from '../constants/icons';
import CustomButton from '../components/CustomButton';
import api from '../utils/api';
import { useState } from 'react';

const Registration = () => {
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    hashedPassword: '',
  });

  const register = () => {
    api.post('/auth/register', authData);
    console.log(authData);
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center space-y-10'>
      <p className=' text-4xl'>Registracija</p>
      <div className='space-y-6'>
        <div className='space-y-3'>
          <FormInput
            inputName='Ime i prezime'
            inputType='text'
            handleChange={(e) =>
              setAuthData({ ...authData, name: e.target.value })
            }
          />
          <FormInput
            inputName='Email'
            inputType='email'
            handleChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
          />
          <FormInput
            inputName='Lozinka'
            inputType='password'
            handleChange={(e) =>
              setAuthData({ ...authData, hashedPassword: e.target.value })
            }
          />
        </div>
        <div className='flex items-center space-x-2'>
          <div className='w-1/2 bg-slate-300 h-[1px]'></div>
          <div className='text-gray-500 text-center text-sm'>ili</div>
          <div className='w-1/2 bg-slate-300 h-[1px]'></div>
        </div>
        <CustomButton
          image={icons.google}
          title='Registrujte se sa Google nalogom'
          customTextStyle='text-sm'
        />
        <CustomButton
          title='Registruj se'
          customStyles='bg-blue-700 text-medium text-white'
          handleClick={register}
        />
        <div className='flex space-x-1 text-sm'>
          <p>Već imate nalog?</p>
          <Link to='/login' className='text-blue-700 font-medium'>
            Prijavite se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
