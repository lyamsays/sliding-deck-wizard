export const welcomeEmail = (email: string) => ({
  subject: "Welcome to Sliding.io",
  html: `
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; background: #7c3aed; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: 800; font-size: 16px;">S</span>
          </div>
          <span style="font-size: 18px; font-weight: 700; color: #111;">Sliding.io</span>
        </div>
      </div>
      
      <h1 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 12px;">Welcome to Sliding.io</h1>
      <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
        Your account is ready. You can now generate AI-powered lecture slides from your notes in under 30 seconds.
      </p>
      
      <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
        <p style="font-weight: 600; color: #7c3aed; margin: 0 0 8px;">Your free plan includes:</p>
        <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 2;">
          <li>3 presentations per month</li>
          <li>Up to 8 slides per deck</li>
          <li>All visual themes</li>
          <li>Present mode & PDF export</li>
        </ul>
      </div>
      
      <a href="https://usesliding.com/create" style="display: block; text-align: center; background: #7c3aed; color: white; font-weight: 600; padding: 14px; border-radius: 12px; text-decoration: none; margin-bottom: 24px;">
        Create your first presentation →
      </a>
      
      <p style="color: #999; font-size: 13px; text-align: center;">
        Questions? Reply to this email or reach me at <a href="mailto:lyam@usesliding.com" style="color: #7c3aed;">lyam@usesliding.com</a>
      </p>
    </div>
  `
});

export const upgradeConfirmEmail = () => ({
  subject: "You're now on Educator Pro 🎉",
  html: `
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; background: #7c3aed; border-radius: 8px;">
            <span style="color: white; font-weight: 800; font-size: 16px; display: block; text-align: center; line-height: 32px;">S</span>
          </div>
          <span style="font-size: 18px; font-weight: 700; color: #111;">Sliding.io</span>
        </div>
      </div>
      
      <h1 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 12px;">You're on Educator Pro</h1>
      <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
        Your upgrade is confirmed. Everything is unlocked — unlimited presentations, document upload, PowerPoint export, and all future features.
      </p>
      
      <a href="https://usesliding.com/create" style="display: block; text-align: center; background: #7c3aed; color: white; font-weight: 600; padding: 14px; border-radius: 12px; text-decoration: none; margin-bottom: 24px;">
        Start creating →
      </a>
      
      <p style="color: #999; font-size: 13px; text-align: center;">
        Questions about your subscription? <a href="mailto:lyam@usesliding.com" style="color: #7c3aed;">lyam@usesliding.com</a>
      </p>
    </div>
  `
});
