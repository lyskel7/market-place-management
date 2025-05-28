import Image from 'next/image';
import Link from 'next/link';

export default async function NotFound() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '97vh',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <Image
        alt="Page not found"
        src={'/404-not-found.jpg'}
        fill
        style={{
          objectFit: 'fill',
          zIndex: 1,
        }}
        priority
      />
      <div
        style={{
          position: 'absolute',
          top: '90%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
          backgroundColor: 'rgb(0,0,0,0.2)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Link
          href={'/'}
          style={{
            color: '#fff',
            textDecorationLine: 'none',
            fontSize: '1.2rem',
          }}
        >
          {'Come back to dashboard'}
        </Link>
      </div>
    </div>
  );
}
