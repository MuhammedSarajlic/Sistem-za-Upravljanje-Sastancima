import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import CustomButton from '../components/CustomButton';
import icons from '../constants/icons';
import { useState } from 'react';
import api from '../utils/api';
import { useGlobalContext } from '../context/GlobalProvider';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [error, setError] = useState<string | null>();
  const [authData, setAuthData] = useState({
    email: '',
    hashedPassword: '',
  });

  const login = async () => {
    try {
      const res = await api.post('/auth/login', authData);

      localStorage.setItem('userId', res.data.id);
      setIsLoggedIn(true);
      setUser(res.data);
      navigate('/');
    } catch (error: any) {
      setIsLoggedIn(false);
      setUser(null);
      setError(error.response.data.message);
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center space-y-10'>
      <p className=' text-4xl'>Prijava</p>
      <div className='space-y-6'>
        <div className='space-y-3'>
          <FormInput
            inputName='Email'
            inputType='email'
            handleChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
            customStyles={error ? 'border-red-600' : ''}
          />
          <FormInput
            inputName='Lozinka'
            inputType='password'
            handleChange={(e) =>
              setAuthData({ ...authData, hashedPassword: e.target.value })
            }
            customStyles={error ? 'border-red-600' : ''}
          />
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='w-1/2 bg-slate-300 h-[1px]'></div>
          <div className='text-gray-500 text-center text-sm'>ili</div>
          <div className='w-1/2 bg-slate-300 h-[1px]'></div>
        </div>
        <CustomButton
          image={icons.google}
          title='Prijavi se sa Google nalogom'
          customTextStyle='text-sm'
        />
        <CustomButton
          title='Prijavi se'
          customStyles='bg-blue-700 text-medium text-white'
          handleClick={login}
        />
        <div className='flex space-x-1 text-sm'>
          <p>Još niste registrovani?</p>
          <Link to='/registration' className='text-blue-700 font-medium'>
            Registracija
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
