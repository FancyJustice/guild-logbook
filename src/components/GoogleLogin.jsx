import { signInWithGoogle, signOutUser } from '../utils/authUtils';

export default function GoogleLogin({ user, onLoginSuccess, onLogoutSuccess }) {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      if (onLogoutSuccess) onLogoutSuccess();
    } catch (error) {
      console.error('Sign out failed:', error);
      alert('Sign out failed. Please try again.');
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-parchment hidden sm:inline">{user.displayName}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-seal text-parchment hover:bg-seal-light transition rounded font-medieval text-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-gold text-wood hover:bg-gold-light transition rounded font-medieval text-sm flex items-center gap-2"
    >
      <i className="ra ra-google" style={{ color: '#2a2420' }}></i>
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Login</span>
    </button>
  );
}
