export function onRequestGet() {
  return new Response(JSON.stringify({ message: "Hello World!" }), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
