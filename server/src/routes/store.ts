import { Router, type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

const router = Router();

// GET /api/store/summary
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const [totalProducts, totalCategories, saleCount, featuredCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments({ onSale: true }),
      Product.countDocuments({ featured: true }),
    ]);
    res.json({ totalProducts, totalCategories, saleCount, featuredCount });
  } catch (err) {
    req.log.error({ err }, "Error fetching store summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// POST /api/store/contact
router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Anvi Clothing Inquiry" <${process.env.MAIL_USER}>`,
      to: "anviclothing2026@gmail.com",
      replyTo: email,
      subject: `New Customer Inquiry from ${name}`,
      text: `You have received a new message from your website contact form.

Name: ${name}
Email: ${email}
Message: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1a1209; padding: 24px; text-align: center; border-bottom: 2px solid #cea53b;">
            <h1 style="color: #cea53b; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">Anvi Clothing</h1>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">Customer Inquiry</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #374151; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Hello,</p>
            <p style="font-size: 15px;">You have received a new inquiry from the contact form on your store website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">Email</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #cea53b; text-decoration: none;">${email}</a></td>
              </tr>
            </table>

            <div style="margin-top: 20px; background-color: #faf7f0; border-left: 4px solid #cea53b; padding: 15px; border-radius: 4px;">
              <p style="font-weight: bold; margin: 0 0 8px 0; color: #1a1209;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap; color: #4b5563; font-style: italic;">"${message}"</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #cea53b; color: #ffffff; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 4px; box-shadow: 0 4px 6px rgba(206,165,59,0.2);">Reply directly to customer</a>
            </div>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
            This email was automatically sent from the Anvi Clothing website.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Inquiry email sent successfully" });
  } catch (err) {
    req.log.error({ err }, "Error sending email inquiry");
    res.status(500).json({ error: "Failed to send inquiry email" });
  }
});

export default router;

