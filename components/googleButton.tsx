import { signIn, signOut, useSession } from 'next-auth/react';

interface SignInButtonProps {
    className?: string;
    children: React.ReactNode;
}


const SignInButton = ({className}: SignInButtonProps) => {
  const { data } = useSession();
  const isSignedIn = !!data?.user;

  return (
    <div>
      {isSignedIn ? (
        <button onClick={() => signOut()} className={`${className`}>Sign out</button>
      ) : (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      )}
    </div>
  );
};

export default SignInButton;
