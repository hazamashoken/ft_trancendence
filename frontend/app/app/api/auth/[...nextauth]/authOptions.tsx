import type { NextAuthOptions } from 'next-auth'
import FortyTwoProvider from "next-auth/providers/42-school";
import _ from 'lodash';

export const authOptions: NextAuthOptions = {
  providers: [
      FortyTwoProvider({
        clientId: `${process.env.FORTY_TWO_CLIENT_ID}`,
        clientSecret: `${process.env.FORTY_TWO_CLIENT_SECRET}`,
      })
  ],
  callbacks: {
    async redirect({url, baseUrl}: {url: string, baseUrl: string}) {
      console.log('redirect');
      return baseUrl;
    },
    // returns token object to be consumed by session()
    async jwt({ token, user, account, profile }: { token: any, user: any, account: any, profile?: any }) {
      // console.log('JWT:', token);
      // console.log('user:', user);
      // console.log('account:', account);
      // console.log('profile:', profile);
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          account: account,
          ftUser: mapFtProfile(profile),
        };
      }
      return token;
    },
    // consumes token object; returns session object
    async session({ session, token }: { session: any, token: any }) {
      console.log('Session');
      session.accessToken = token.accessToken;
      session.ftUser = token.ftUser;
      session.user = {};
      console.log(session);
      return session;
    },
  }
}

function mapFtProfile (profile: any) {
  return _.pick(profile, [
    'id', 'email', 'login', 'first_name', 'last_name', 'url', 'displayname', 'image.link'
  ]);
}