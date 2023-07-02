import type { NextAuthOptions } from 'next-auth'
import FortyTwoProvider from "next-auth/providers/42-school";

export const authOptions: NextAuthOptions = {
  providers: [
      FortyTwoProvider({
        clientId: `${process.env.FORTY_TWO_CLIENT_ID}`,
        clientSecret: `${process.env.FORTY_TWO_CLIENT_SECRET}`
      })
  ],
  callbacks: {
    async redirect({url, baseUrl}: {url: string, baseUrl: string}) {
      return baseUrl;
    },
    // returns token object to be consumed by session()
    async jwt({ token, user, account, profile }: { token: any, user: any, account: any, profile?: any }) {
      if (account && user) {
        return {
          ...token,
          bearerToken: user.token,
          user: user.profile,
          // profile: profile,
          profile: profile.cursus_users[0].user

        };
      }

      return token;
    },
    // consumes token object; returns session object
    async session({ session, token }: { session: any, token: any }) {
      session.user.token = token.bearerToken;
      session.user.profile = token.profile;
      // session.user.username = token.username;
      // session.user.id = token.profile.id;
      return session;
    },
  }
}
