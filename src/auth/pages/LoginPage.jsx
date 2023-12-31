import { useEffect } from 'react';
import { useForm } from '../../hooks';
import { useAuthStore } from '../../hooks/useAuthStore';
import './LoginPage.css';
import toast, { Toaster } from 'react-hot-toast';

const loginFormFields = {
  loginEmail: '',
  loginPassword: '',
}

const registerFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerConfirmPassword: '',
}

export const LoginPage = () => {

  const { startLogin, startRegister, errorMessage } = useAuthStore();
  const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginFormFields);
  const { registerName, registerEmail, registerPassword, registerConfirmPassword, onInputChange: onRegisterInputChange } = useForm(registerFormFields);

  const loginSubmit = (e) => {
    e.preventDefault();
    startLogin({ email: loginEmail, password: loginPassword });
  }

  const registerSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      toast.error('The passwords do not match!');
      return;
    }
    startRegister({ name: registerName, email: registerEmail, password: registerPassword });
  }
  useEffect(() => {
    if (errorMessage !== undefined) {
      toast.error(errorMessage);
    }

  }, [errorMessage])


  return (

    <div className="container login-container">
      <Toaster />
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Ingreso</h3>
          <form onSubmit={loginSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Correo"
                name='loginEmail'
                value={loginEmail}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name='loginPassword'
                value={loginPassword}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Login"
              />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Registro</h3>
          <form onSubmit={registerSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name='registerName'
                value={registerName}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                name='registerEmail'
                value={registerEmail}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name='registerPassword'
                value={registerPassword}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repita la contraseña"
                name='registerConfirmPassword'
                value={registerConfirmPassword}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Crear cuenta" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}