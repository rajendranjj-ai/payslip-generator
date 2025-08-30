# Payslip Generator - Updated Instructions

## 🎉 **What Changed**

Your payslip generator has been updated to be **much simpler to use**:

✅ **Automatic Sheet Integration** - No need to enter Google Sheet ID manually  
✅ **Flexible Field Support** - Works with whatever columns you have in your sheet  
✅ **Smart Column Detection** - Automatically maps columns based on header names  
✅ **Auto-Loading** - Employees load automatically when you open the app  

## 🚀 **How to Use (Simplified)**

### **Step 1: Make sure your `.env.local` is set up**
Your environment file should contain:
```bash
DEFAULT_SPREADSHEET_ID=1fVcuVv-dvJnQwOogNq8DNo2okfJpGrL4NQi8QqAoSUg
GOOGLE_SHEETS_PROJECT_ID=payslip-generator-470604
# ... other Google credentials
```

### **Step 2: Start the application**
```bash
npm run dev
```

### **Step 3: Open and use**
- Visit: http://localhost:3000
- **No Google Sheet ID needed** - it uses the one from your environment
- **Employees load automatically** on page load
- Select month/year and generate payslips

## 📊 **Flexible Google Sheet Format**

The app now works with **any sheet structure**! It will intelligently detect columns based on header names.

### **Supported Header Names (case-insensitive)**

| Field | Detects Headers Like |
|-------|---------------------|
| **Name** | "Name", "Employee Name", "Full Name" |
| **Employee ID** | "ID", "Employee ID", "EmpID", "Employee" |
| **Designation** | "Designation", "Title", "Position" |
| **Department** | "Department", "Dept", "Division" |
| **Email** | "Email", "Email Address" |
| **Phone** | "Phone", "Mobile", "Contact" |
| **Basic Salary** | "Basic", "Basic Salary", "Salary" |
| **HRA** | "HRA", "House Rent", "House" |
| **DA** | "DA", "Dearness", "Dearness Allowance" |
| **Conveyance** | "Conveyance", "Transport" |
| **Medical** | "Medical", "Health" |
| **Special Allowance** | "Special", "Other Allowance" |
| **Provident Fund** | "PF", "Provident", "Provident Fund" |
| **Professional Tax** | "PT", "Professional Tax" |
| **Income Tax** | "Tax", "Income Tax" |
| **Bank Name** | "Bank", "Bank Name" |
| **Account Number** | "Account", "Account Number" |
| **IFSC** | "IFSC", "IFSC Code" |

### **Example Sheet Formats That Work:**

**Option 1: Simple Format**
```
Name | ID | Basic | HRA | PF
John | E001 | 50000 | 15000 | 5000
```

**Option 2: Detailed Format**
```
Employee Name | Employee ID | Designation | Basic Salary | House Rent | Provident Fund | Bank Name
John Doe | EMP001 | Developer | 50000 | 15000 | 5000 | HDFC Bank
```

**Option 3: Your Custom Format**
- The app will find matching columns automatically
- Missing columns will default to 0 or "Not specified"
- Only **Name**, **Employee ID**, and **Basic Salary** are truly required

## 🔧 **Troubleshooting**

### **"Unable to access Google Sheet"**
1. Enable Google Sheets API: https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=payslip-generator-470604
2. Ensure sheet is shared with: `payslip-service-account@payslip-generator-470604.iam.gserviceaccount.com`

### **"No employees found"**
1. Check that your sheet has data in rows 2 and below
2. Ensure at least Name and Basic Salary columns exist
3. Check that headers are in Row 1

### **Missing data shows as "0" or "Not specified"**
- This is normal! The app handles missing fields gracefully
- Add more columns to your sheet for complete data

## 🎯 **Quick Start Checklist**

- [ ] ✅ Google Sheets API enabled
- [ ] ✅ Service account has sheet access  
- [ ] ✅ `.env.local` has `DEFAULT_SPREADSHEET_ID`
- [ ] ✅ Sheet has Name + Basic Salary columns minimum
- [ ] ✅ Data starts from Row 2 (Row 1 = headers)
- [ ] ✅ Run `npm run dev` and visit http://localhost:3000

Your payslip generator is now **much easier to use** and **more flexible**! 🚀
