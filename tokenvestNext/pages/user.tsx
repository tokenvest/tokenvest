import React from "react";
import { getSession, signOut } from "next-auth/react";

type UserProps = {
  user: any;
};

// gets a prop from getServerSideProps
function User({ user }: UserProps) {
  return (
    <div>
      <h4>User session:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default User;
