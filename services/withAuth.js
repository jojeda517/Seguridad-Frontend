// services/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const router = useRouter();

        useEffect(() => {
            checkAuth();
        }, []); // Solo se ejecuta en montaje

        const checkAuth = async () => {
            try {

                // Verifica si el usuario está autenticado al intentar obtener la información del usuario
                const userRole = localStorage.getItem('userRole');
                const firstName = localStorage.getItem('firstName');
                const lastName = localStorage.getItem('lastName');

                // Si las credenciales no son correctas, redirige a la página de inicio de sesión
                if (!userRole || !firstName || !lastName) {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error al verificar la autenticación', error);
                router.push('/login');
            }
        };

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};
