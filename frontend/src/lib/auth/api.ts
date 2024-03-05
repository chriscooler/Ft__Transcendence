import { goto } from "$app/navigation";

export async function fetchUserData(): Promise<any> {
  const token = localStorage.getItem("jwt");

  const responseUser = await fetch(
    "http://localhost:3000/user/profile",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (responseUser.ok) {
    const user = await responseUser.json();
    return user;
  } else {
    goto("/");
    throw new Error("Failed to fetch user data");
  }
}
