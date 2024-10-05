export default function MorphingLoader() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#3498db',
          animation: 'morph 1.5s ease-in-out infinite',
        }} />
        <style>
          {`
            @keyframes morph {
              0%, 100% { border-radius: 50%; transform: rotate(0deg); }
              25% { border-radius: 0; transform: rotate(45deg); }
              50% { border-radius: 25%; transform: rotate(165deg); }
              75% { border-radius: 0; transform: rotate(180deg); }
            }
          `}
        </style>
      </div>
    )
  }