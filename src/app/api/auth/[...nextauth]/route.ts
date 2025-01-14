import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import CryptoJS from 'crypto-js';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    signOut: '/logout',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const username = credentials?.username;
        const password = credentials?.password;
        // [TBD:Jaspal] Should be actual DB query if user database table exists
        const response = {
          rows: [{ id: '1001', email: 'johndoe@example.com' }],
        };
        const user = response.rows[0];
        const LOGIN_CODE = process.env.NEXT_PUBLIC_LOGIN_CODE;
        const PWD_CODE = process.env.NEXT_PUBLIC_PWD_CODE;
        const usrCipher = CryptoJS.SHA256(username).toString();
        const pwdCipher = CryptoJS.SHA256(password).toString();
        if (usrCipher == LOGIN_CODE && pwdCipher == PWD_CODE) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        console.log('credentials', credentials);
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
