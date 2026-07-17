export const fmtDate = (date?: string) => {
    if (!date) return "—";
  
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  
  
  export const calcAge = (dob?: string) => {
    if (!dob) return "—";
  
    const age = Math.floor(
      (Date.now() - new Date(dob).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    );
  
    return age > 0 ? `${age} yrs` : "—";
  };
  
  
  export const initials = (name?: string) => {
    if (!name) return "?";
  
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  
  export const fuStatus = (date?: string) => {
    if (!date) return "empty";
  
    const today = new Date();
    today.setHours(0,0,0,0);
  
    const followDate = new Date(date);
    followDate.setHours(0,0,0,0);
  
    const diff =
      (followDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);
  
  
    if (diff < 0) return "over";
  
    if (diff === 0) return "today";
  
    if (diff <= 7) return "soon";
  
    return "ok";
  };