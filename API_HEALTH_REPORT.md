# Midas Fun API - Status & Health Report
**Date:** Sunday, 17 May 2026
**Test User:** rahul / 123
**Environment:** http://api.midasfun.com/api/

---

## 🟢 1. Working APIs (Success 200)
These APIs are fully connected and return data with the test user.

| Module | Endpoint | Method | Result |
| :--- | :--- | :--- | :--- |
| Auth | `Login/CheckLogin` | POST | Success (Token acquired) |
| Customer | `CusModule/CusLogin` | POST | Success |
| Customer | `CusModule/RegOrEditCustomer` | POST | Success |
| Dashboard | `MangementDashBoard/ManagementValues` | POST | Success |
| Dashboard | `MangementDashBoard/GameRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/ProductRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/RedemptionRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/EventRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/FBRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/TrampolineRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/BowlingRevenueGraph` | POST | Success |
| Dashboard | `MangementDashBoard/UpcomingEvent` | POST | Success |
| Dashboard | `MangementDashBoard/MainGraph` | POST | Success |

---

## 🟡 2. Access Restricted APIs (Status 401)
The endpoints exist, but the test user `rahul` is unauthorized. This usually means the user lacks the specific roles or branch permissions on the backend.

**Critical Impact:** This blocks testing of all Reports and management functions.

| Module | Endpoint | Method | Note |
| :--- | :--- | :--- | :--- |
| Recharge | `Recharge/VerifyNumber` | POST | Needs Auth |
| Recharge | `Recharge/GetCustomerDetails` | POST | Needs Auth |
| Recharge | `Recharge/Recharge` | POST | Needs Auth |
| Customer | `Customer/GetCustomerList` | POST | Needs Auth |
| Reports | `Report/CashRevenueReport` | POST | Needs Auth |
| Reports | `Report/GameRevenueReport` | POST | Needs Auth |
| Reports | `Report/SalesReport` | POST | Needs Auth |
| Reports | `Report/SalesDetailReport` | POST | Needs Auth |
| Reports | `Report/RedeemptionReport` | POST | Needs Auth |
| Reports | `Report/RechargeReport` | POST | Needs Auth |
| Reports | `Report/CardLiabilityReport` | POST | Needs Auth |
| Reports | `Report/ClearCardReport` | POST | Needs Auth |
| Reports | `Report/CardConsolidateReport` | POST | Needs Auth |
| Reports | `Report/CardVoidReport` | POST | Needs Auth |
| ... | (And 100+ more) | POST | See `API_DOCS.md` |

---

## 🔴 3. Missing or Broken Routes (Status 404)
These endpoints are documented but **do not exist** on the server. The backend team needs to create these routes.

| Module | Endpoint | Method | Request Example |
| :--- | :--- | :--- | :--- |
| Reports | `Report/CardTransferReport` | POST | `?fTime=01-01-2025&tTime=01-12-2026&BranchId=1030` |
| Reports | `Report/GroupSale` | POST | `?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030` |
| Recharge | `Recharge/VerifyOtp` | GET | `?Otp=1234` |
| DropDown | `DropDown/EmployeeList` | GET | `?BranchId=1030` |
| Event | `Event/GetEventListById` | GET | `?EventId=174` |

---

## ❌ 4. Media Type Issues (Status 415)
The backend does not accept the current JSON format for these endpoints, likely requiring `multipart/form-data`.

| Module | Endpoint | Method | Issue |
| :--- | :--- | :--- | :--- |
| Waiver | `Waiver/RegisterWaiverTemplate` | POST | Unsupported Media Type |
| Waiver | `Waiver/RegisterWaiverForm` | POST | Unsupported Media Type |

---

## Technical Recommendations for Fixes

1. **CardTransferReport (404):** The backend needs to expose the `Report/CardTransferReport` route. The frontend is ready and expects a `POST` request (consistent with working reports).
2. **Permissions (401):** The user `rahul` needs to be granted "Admin" or "SuperUser" privileges in the backend database to test the reports.
3. **Waiver (415):** The `RegisterWaiverForm` should be handled using `FormData` in the frontend instead of JSON if the backend expects a signature file/logo.
4. **Consistency:** Many reports are currently documented as `GET` in `API_DOCS.md` but only work as `POST` (e.g., Dashboard). We recommend the backend team standardizes these.
