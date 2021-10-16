function getUsername(): string {
  let username: string = "";

  if (typeof window != "undefined") {
    username = sessionStorage.getItem("username")!;
  }

  return username;
}

export default getUsername;
