import { headers, cookies } from 'next/headers';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';
import Image from 'next/image';
import Link from 'next/link';

async function isAuthenticatedInServerComponent(): Promise<boolean> {
  try {
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          return (
            session.tokens?.accessToken !== undefined &&
            session.tokens?.idToken !== undefined
          );
        } catch (error) {
          console.log('fetchAuthSession error in not-found.tsx:', error);
          return false;
        }
      },
    });
    return authenticated;
  } catch (error) {
    console.error(
      'Error en runWithAmplifyServerContext en not-found.tsx:',
      error,
    );
    return false;
  }
}

export default async function NotFound() {
  const authenticated = await isAuthenticatedInServerComponent();

  const href = authenticated ? '/' : '/auth/signin';
  const linkText = authenticated ? 'Volver al Dashboard' : 'Iniciar Sesión';

  const headersList = headers();
  const domain = (await headersList).get('host');

  return (
    <div
      style={{
        position: 'relative', // Contenedor padre para el posicionamiento absoluto del enlace
        width: '100vw', // Ocupa todo el ancho de la ventana
        height: '100vh', // Ocupa todo el alto de la ventana
        display: 'flex', // Opcional: si quieres centrar la imagen si no ocupa todo
        justifyContent: 'center', // Opcional
        alignItems: 'center', // Opcional
        overflow: 'hidden', // Para evitar barras de scroll si la imagen es ligeramente más grande
      }}
    >
      <Image
        alt="Page not found"
        src={'/not-found.jpg'} // Asegúrate que la ruta a tu imagen sea correcta desde la carpeta `public`
        fill // 'fill' hará que la imagen ocupe todo el espacio de su contenedor relativo padre
        style={{
          objectFit: 'cover', // 'cover' asegura que la imagen cubra el área sin distorsionarse
          zIndex: 1, // Image behind link
        }}
        priority
      />
      <div
        style={{
          position: 'absolute',
          top: '95%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Perfect center
          zIndex: 2, // Link over image
          textAlign: 'center', // Center text if multiline
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '10px 20px',
          borderRadius: '5px',
          color: 'white',
        }}
      >
        <Link
          href={href}
          style={{
            color: '#61dafb',
            textDecoration: 'underline',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
