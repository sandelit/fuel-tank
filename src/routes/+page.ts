import type { PageLoad } from "./$types";
import { userSession } from "$lib/store";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = ({ params }) => {
  userSession.subscribe((val) => {
    if (val === false) {
      redirect(302, "/login");
    }
  });
};
