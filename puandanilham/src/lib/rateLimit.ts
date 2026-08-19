const rateLimit = (limit: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (ip: string): boolean => {
    const now = Date.now();
    const record = requests.get(ip);
    
    if (!record || now > record.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return true; // allowed
    }
    
    if (record.count >= limit) {
      return false; // blocked
    }
    
    record.count++;
    return true; // allowed
  };
};

// Max 5 RSVP submissions per IP per 15 minutes
export const rsvpLimiter = rateLimit(5, 15 * 60 * 1000);

// Max 10 wishes per IP per 15 minutes
export const wishesLimiter = rateLimit(10, 15 * 60 * 1000);

// Max 10 photobooth uploads per IP per 30 minutes
export const photoboothLimiter = rateLimit(10, 30 * 60 * 1000);
