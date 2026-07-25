const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/600x600?text=No+Image";
  if (img.startsWith("http")) return img;
  const clean = img.replace(/\\/g, "/");
  return `${BACKEND_URL}${clean.startsWith("/") ? clean : `/${clean}`}`;
};