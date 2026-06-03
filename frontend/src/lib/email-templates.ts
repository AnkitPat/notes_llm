export const getAdminApprovalEmail = (userEmail: string) => {
  return `
    <div style="font-family: sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="background: white; max-width: 500px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #2563EB; padding: 30px; text-align: center;">
          <span style="color: white; font-weight: bold; font-size: 24px;">Notes LLM - Admin Alert</span>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #111827; margin-top: 0;">New User Pending Approval</h2>
          <p style="color: #4b5563; line-height: 1.6;">A new user has signed up and is waiting for your approval.</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;"><strong>User Email:</strong> ${userEmail}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/api/admin/approve?email=${userEmail}" style="background: #2563EB; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Approve User</a>
          </div>
        </div>
      </div>
    </div>
  `;
};
