// Email Service - Mock implementation
// When real email service is connected (SendGrid/SES), swap sendEmail function

export interface EmailTemplate {
  subject: string;
  body: string;
  type: 'welcome' | 'application' | 'deadline' | 'update' | 'verification';
}

export function generateEmail(
  type: EmailTemplate['type'],
  data: Record<string, string>
): EmailTemplate {
  const templates: Record<string, EmailTemplate> = {
    welcome: {
      subject: `Welcome to UGOVA, ${data.name || 'User'}!`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0c4a6e;">Welcome to UGOVA!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>Your account has been successfully created. UGOVA is your AI-powered Government Opportunity Assistant.</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #0369a1;">What you can do:</h3>
            <ul>
              <li>Browse Jobs, Schemes & Exams</li>
              <li>Get AI-powered recommendations</li>
              <li>Check eligibility instantly</li>
              <li>Track your applications</li>
              <li>Get deadline reminders</li>
            </ul>
          </div>
          <p><a href="${data.dashboardUrl || '/dashboard'}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
          <p style="color: #666; font-size: 12px;">This is an automated email from UGOVA - AI Government Opportunity Assistant.</p>
        </div>
      `,
      type: 'welcome',
    },
    application: {
      subject: `Application Confirmation: ${data.title || 'Opportunity'}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0c4a6e;">Application Saved!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>You have saved the following opportunity to your UGOVA dashboard:</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0;">${data.title || 'Opportunity'}</h3>
            <p><strong>Organization:</strong> ${data.organization || 'N/A'}</p>
            <p><strong>Type:</strong> ${data.type || 'N/A'}</p>
            <p><strong>Last Date:</strong> ${data.lastDate || 'N/A'}</p>
          </div>
          <p><strong>Next Step:</strong> Visit the official website to complete your application:</p>
          <p><a href="${data.applyLink || '#'}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Apply on Official Site</a></p>
          <p style="margin-top: 20px;"><a href="${data.dashboardUrl || '/dashboard'}" style="color: #0ea5e9;">View in Dashboard</a></p>
          <p style="color: #666; font-size: 12px;">UGOVA - Track all your applications in one place.</p>
        </div>
      `,
      type: 'application',
    },
    deadline: {
      subject: `Deadline Alert: ${data.title || 'Opportunity'}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #dc2626;">Deadline Approaching!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>This is a reminder that the application deadline is approaching:</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #dc2626;">${data.title || 'Opportunity'}</h3>
            <p><strong>Last Date:</strong> ${data.lastDate || 'N/A'}</p>
            <p><strong>Days Remaining:</strong> ${data.daysRemaining || 'Few'} days</p>
          </div>
          <p><a href="${data.applyLink || '#'}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Apply Now</a></p>
          <p style="color: #666; font-size: 12px;">Don't miss this opportunity! Apply before the deadline.</p>
        </div>
      `,
      type: 'deadline',
    },
    update: {
      subject: `New Opportunity Alert - UGOVA`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0c4a6e;">New Opportunity Matching Your Profile!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>We found a new opportunity that matches your profile:</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0;">${data.title || 'New Opportunity'}</h3>
            <p>${data.description || 'Check it out now!'}</p>
          </div>
          <p><a href="${data.link || '/'}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Details</a></p>
          <p style="color: #666; font-size: 12px;">UGOVA - Personalized Government Opportunity Assistant</p>
        </div>
      `,
      type: 'update',
    },
    verification: {
      subject: `Document Verification Update`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: ${data.status === 'verified' ? '#16a34a' : '#dc2626'};">
            Document ${data.status === 'verified' ? 'Verified' : 'Status Update'}
          </h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>Your uploaded document has been reviewed:</p>
          <div style="background: ${data.status === 'verified' ? '#f0fdf4' : '#fef2f2'}; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Document Type:</strong> ${data.documentType || 'N/A'}</p>
            <p><strong>Status:</strong> <span style="color: ${data.status === 'verified' ? '#16a34a' : '#dc2626'}; font-weight: bold;">${data.status?.toUpperCase() || 'PENDING'}</span></p>
            ${data.status === 'rejected' ? `<p><strong>Reason:</strong> ${data.reason || 'Please re-upload a clearer document.'}</p>` : ''}
          </div>
          <p><a href="${data.profileUrl || '/profile'}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Profile</a></p>
          <p style="color: #666; font-size: 12px;">UGOVA Document Verification System</p>
        </div>
      `,
      type: 'verification',
    },
  };

  return templates[type] || templates.welcome;
}

// Mock send function - logs to console
export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // In production, this would call SendGrid/SES API
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: ${template.subject}`);
  console.log(`[EMAIL] Type: ${template.type}`);
  console.log('--- Email body (HTML) ---');

  // Simulate async delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Log to console as mock
  return {
    success: true,
    messageId: `mock-email-${Date.now()}`,
  };
}

// Trigger email for specific events
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const template = generateEmail('welcome', { name });
  await sendEmail(to, template);
}

export async function sendApplicationEmail(
  to: string,
  name: string,
  title: string,
  organization: string,
  type: string,
  lastDate: string,
  applyLink: string
): Promise<void> {
  const template = generateEmail('application', {
    name,
    title,
    organization,
    type,
    lastDate,
    applyLink,
  });
  await sendEmail(to, template);
}

export async function sendDeadlineReminder(
  to: string,
  name: string,
  title: string,
  lastDate: string,
  daysRemaining: string,
  applyLink: string
): Promise<void> {
  const template = generateEmail('deadline', {
    name,
    title,
    lastDate,
    daysRemaining,
    applyLink,
  });
  await sendEmail(to, template);
}
