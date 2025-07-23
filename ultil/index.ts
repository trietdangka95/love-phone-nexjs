export const getImageUrl = (img: string) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  // Lấy baseURL từ biến môi trường, bỏ /api nếu có
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
    /\/api$/,
    ""
  );
  return `${base}${img}`;
};
