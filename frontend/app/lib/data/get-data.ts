import { Session } from "next-auth";
import { IGetDataInit } from "./types";

/**
 * getData<DataType>(session: any, url: string)
 *
 * To be use `server-sided` only
 *
 * @typeParam DataType is the type of the data returned from the endpoint
 * @param {Session} session from getServerSession(authOptions);
 * @param {string | URL} url of the endpoint to call
 * @param {IGetDataInit} [init] init object to override the default fetch options
 *
 * @param {string} [init.cache] cache option for fetch, default to { "no-store" }
 * @param {string | string[][] | Record<string, any> | URLSearchParams | undefined} [init.queryParams] query params to be added to the url
 * @param {RequestInit} [init.options] options use to override the default fetch options
 *
 * @default fetch options
 * ```
 * const requestInit: RequestInit = {
    method: "GET",
    body: null,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: cache,
    ...options,
  };
 * ```
 *
 * @example
 * ```
 * import { getData } from "@/lib/data/get-data";
 *
 * export const getServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/org/${orgId}/book/${bookId}/chapter/${chapterId}/`;
    const queryParams = {
      move: 1
    }
    const data = await getData<IChapter>(session, url, {queryParams});

    return {
      props: {
      data,
      },
    };
 * ```
 */
export async function getData<DataType>(
  session: Session,
  url: string | URL,
  init: IGetDataInit = {}
) {
  const {
    cache = "no-store",
    queryParams = undefined,
    options = {},
    ...other
  } = init;
  const token = session?.user?.token;
  const finalized_url = !!queryParams
    ? url + "?" + new URLSearchParams(queryParams).toString()
    : url;

  const requestInit: RequestInit = {
    method: "GET",
    body: null,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
    },
    cache: cache,
    ...options,
  };

  const response = await fetch(finalized_url, requestInit);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data: DataType = await response.json();

  return data;
}
