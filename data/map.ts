"use server";

import { BODY_TRACKER, TRACKER_API_URL } from "@/config/tracker";

export const getBuses = async (): Promise<{
  result: [
    string,
    [
      longitude: number,
      latitude: number,
      id: string,
      isDriving: boolean
    ][]
  ]
}> => {
  const res = await fetch(TRACKER_API_URL, {
    body: BODY_TRACKER,
    method: "POST",
  })
  return res.json()
}