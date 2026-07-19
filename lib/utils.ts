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



/**
 * To do 
 * Normalizes a phone string by removing non-digits and keeping the core subscriber number.
 * - Handles local formats: '0974...' -> '974...'
 * - Handles international structures: '+251974...' or '+1415...' -> extracts last 9-10 core digits
 */
export function normalizePhone(phoneStr: string): string {
  const cleaned = phoneStr.replace(/\D/g, "");
  
  // 2. Handle standard Ethiopian / dynamic local structures 
  // If it starts with local prefix '0', strip it off to compare core subscriber digits
  if (cleaned.startsWith("0")) {
    return cleaned.slice(1);
  }
  
  // If it includes the Ethiopian country code '251' at the start, drop it
  if (cleaned.startsWith("251")) {
    return cleaned.slice(3);
  }
  
  // 3. Generic fallback for international variants:
  // Most international subscriber numbers are between 9 to 10 digits long.
  // Grabbing the final 9 digits guarantees a matched core identifier regardless of prepended country codes.
  return cleaned.length >= 9 ? cleaned.slice(-9) : cleaned;
}