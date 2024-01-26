import { json } from "@sveltejs/kit";
import { PRIVATE_LOGIN_PASS } from "$env/static/private";

export async function POST(event) {
  const body = await event.request.json();

  if (body.password === PRIVATE_LOGIN_PASS) {
    return json({ status: 200, message: "User logged in", success: true });
  } else {
    return json({ status: 401, success: false });
  }
}
