import { DefaultSession } from "next-auth";

declare module "next-auth" {

    interface User {
        profile?: any;
        token: string;
        account: any;
    }

    interface Session extends DefaultSession {
        user?: User
    }

}
