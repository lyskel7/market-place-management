import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Página No Encontrada</h2>
      <p>Lo sentimos, no pudimos encontrar la página que estabas buscando.</p>
      <p>
        <Link href="/">Volver al Inicio</Link>
      </p>
    </div>
  );
}
