import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, slug } = req.query;

  if (secret !== process.env.PREVIEW_SECRET || typeof slug !== "string" || !slug) {
    return res.status(401).json({ message: "Invalid preview token" });
  }

  res.setPreviewData({});
  res.redirect(`/${slug}/`);
}
