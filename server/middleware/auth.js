import jwt from "jsonwebtoken";

export function authMiddleware(request, response, next) {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function adminOnly(request, response, next) {
  if (request.user?.role !== "Admin") {
    return response.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

export function userOnly(request, response, next) {
  if (request.user?.role !== "User") {
    return response.status(403).json({ success: false, message: "User access required" });
  }
  next();
}
