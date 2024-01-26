import { writable } from "svelte/store";

export const userSession = writable(false);
export const updateTrigger = writable(0);
