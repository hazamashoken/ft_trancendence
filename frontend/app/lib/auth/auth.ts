import type { NextAuthOptions } from "next-auth";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import FortyTwoProvider from "next-auth/providers/42-school";

export const authOptions = {
  providers: [
    FortyTwoProvider({
      clientId: `${process.env.FORTY_TWO_CLIENT_ID}`,
      clientSecret: `${process.env.FORTY_TWO_CLIENT_SECRET}`,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl;
    },
    // returns token object to be consumed by session()
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: any;
      user: any;
      account: any;
      profile?: any;
    }) {
      if (account && user) {
        return {
          ...token,
          account: account,
          user: user.profile,
          // profile: profile,
          profile: profile.cursus_users[0].user,
        };
      }

      return token;
    },
    // consumes token object; returns session object
    async session({ session, token }: { session: any; token: any }) {
      session.user.account = token.account;
      session.user.token = session.user.account.access_token;
      session.user.profile = token.profile;
      return session;
    },
  },
} satisfies NextAuthOptions;


export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions)
}