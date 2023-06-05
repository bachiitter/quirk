// A helper function to create a JSON respons
export const jsonResp = <T>(body: T, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
