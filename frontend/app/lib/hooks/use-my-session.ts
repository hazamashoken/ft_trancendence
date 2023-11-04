import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";


/**
 * useMySession
 *
 * Client-side service to get {session, token, orgId, headers} of the current user
 *
 * @return {obj}: {session, token, orgId, headers}
 */
export const useMySession = () => {

  const session = useSession();
  const token = session.data?.user?.token;
  const orgId = session.data?.user?.profile?.organization?.id;
  const isadmin = session.data?.user?.profile?.is_admin;
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  return (
    { session, token, orgId, headers, isadmin }
  )
}

/**
 * useMyServerSession
 *
 * Server-side service to get {session, token, orgId, headers} of the current user
 * @important : Don't forget to async this
 * @return {obj}: {session, token, orgId, headers}
 */
export async function getMyServerSession() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  return (
    { session, token, headers }
  )
}