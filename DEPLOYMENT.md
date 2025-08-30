# 🚀 Vercel Deployment Guide

Deploy your payslip generator to Vercel in minutes with this step-by-step guide.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ Google Sheets API credentials
- ✅ Google Sheet with employee data

## 🚀 Quick Deploy

### **Option 1: One-Click Deploy (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajendranjj-ai/payslip-generator)

### **Option 2: Manual Deploy**

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `rajendranjj-ai/payslip-generator`
   - Click "Deploy"

## 🔧 Environment Variables Setup

After deployment, configure these environment variables in Vercel:

### **1. Go to Project Settings**
- Open your deployed project in Vercel
- Go to "Settings" → "Environment Variables"

### **2. Add Required Variables**

| Variable | Value | Description |
|----------|-------|-------------|
| `GOOGLE_SHEETS_PROJECT_ID` | `your-project-id` | Google Cloud project ID |
| `GOOGLE_SHEETS_PRIVATE_KEY_ID` | `your-private-key-id` | Service account private key ID |
| `GOOGLE_SHEETS_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\n...` | Service account private key (with quotes) |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | `service@project.iam.gserviceaccount.com` | Service account email |
| `GOOGLE_SHEETS_CLIENT_ID` | `123456789012345678901` | Service account client ID |
| `DEFAULT_SPREADSHEET_ID` | `1fVcuVv-dvJnQwOogNq8DNo2okfJpGrL4NQi8QqAoSUg` | Your Google Sheet ID |
| `NEXT_PUBLIC_APP_NAME` | `"Payslip Generator"` | Application name |
| `NEXT_PUBLIC_COMPANY_NAME` | `"St.Madonna's Matric Hr Sec School"` | Your school name |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | `"Sattur - Sivakasi - Kalugumalai Rd, Kalugumalai, Tamil Nadu 628552"` | School address |

### **3. Environment Variable Tips**

#### **Private Key Format**
```bash
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwgg...\n-----END PRIVATE KEY-----\n"
```

#### **Multi-line Variables**
- Use `\n` for line breaks
- Wrap entire value in quotes
- Don't add extra spaces

## 🔄 Deployment Process

### **1. Automatic Deployments**
- Every push to `main` branch triggers new deployment
- Preview deployments for pull requests
- Rollback to previous versions anytime

### **2. Build Process**
```bash
# Vercel runs these automatically:
npm install
npm run build
npm start
```

### **3. Custom Domains** (Optional)
- Go to "Settings" → "Domains"  
- Add your custom domain
- Configure DNS records

## 📊 Monitoring & Logs

### **View Deployment Logs**
- Go to "Deployments" tab
- Click on any deployment
- View build and runtime logs

### **Function Logs**
- Go to "Functions" tab
- Monitor API performance
- View error logs

## 🔧 Optimization Features

✅ **Edge Functions**: API routes run on Vercel's edge network  
✅ **Automatic Scaling**: Handles traffic spikes automatically  
✅ **Built-in CDN**: Static assets served from global CDN  
✅ **Zero Config**: Works out of the box with Next.js  

## 🎯 Post-Deployment Testing

### **1. Test Basic Functionality**
- Visit your deployed URL
- Check if employees load from Google Sheets
- Generate a test payslip
- Download PDF

### **2. Test API Endpoints**
```bash
# Replace YOUR_DOMAIN with your Vercel URL
curl https://YOUR_DOMAIN.vercel.app/api/employees
curl -X POST https://YOUR_DOMAIN.vercel.app/api/payslips/generate
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Environment Variables Not Working**
- Check variable names (case-sensitive)
- Ensure private key has proper `\n` line breaks
- Redeploy after adding variables

#### **2. Google Sheets Access Denied**
- Verify service account email in sheet sharing
- Check if Google Sheets API is enabled
- Validate credentials format

#### **3. Build Failures**
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Test build locally: `npm run build`

### **Getting Help**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Issues](https://github.com/rajendranjj-ai/payslip-generator/issues)

## 🎉 Success!

Your payslip generator is now live on Vercel! 

**Next Steps:**
- Share the URL with your team
- Set up custom domain (optional)
- Monitor usage in Vercel dashboard
- Configure automatic deployments

---

**Live Demo**: `https://your-project.vercel.app`  
**Admin Panel**: `https://vercel.com/dashboard`
