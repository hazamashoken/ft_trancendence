import { DefaultSession } from "next-auth";

declare module "next-auth" {

    interface User {
        profile?: any
    }

    interface Session extends DefaultSession {
        user?: User
    }

}
