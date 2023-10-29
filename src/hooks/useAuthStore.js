import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearError, onChecking, onLogin, onLogout } from "../store/auth/authSlice";
import { onLogoutCalendar } from "../store";

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {

        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth', {
                email,
                password,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            dispatch(onLogout('Invalid email or password'));

            setTimeout(() => {
                dispatch(clearError());
            }, 80);
        }
    }
    const startRegister = async ({ email, password, name }) => {

        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth/new', {
                email,
                password,
                name,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            dispatch(onLogout(error.response.data?.msg || 'ERROR:: Register failed'));

            setTimeout(() => {
                dispatch(clearError());
            }, 80);
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            dispatch(onLogout());
            return;
        }

        try {
            const { data } = await calendarApi.get('/auth/renew');

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-date');
        dispatch(onLogoutCalendar());
        dispatch(onLogout());
    }


    return {
        errorMessage,
        status,
        user,


        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }
}
