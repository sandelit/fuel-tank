import { json } from "@sveltejs/kit";
import { supabaseClient } from "$lib/supabase";

export async function GET(event) {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("id", { ascending: false })
    .limit(50);

  return json(data);
}

export async function POST(event) {
  const body = await event.request.json();

  const { error: err } = await supabaseClient
    .from("events")
    .insert(body);
  if (err) {
    //console.log(err);
    return json({
      status: 500,
      message: "Server error. Please try again later",
      success: false,
    });
  }
  return json({ status: 201, message: "Event created", success: true });
}
