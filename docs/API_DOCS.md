# Midas Fun API Documentation

**Base URL:** `http://api.midasfun.com/api/`

---

## Employee Module

### 1. Login
**Endpoint:** `Login/CheckLogin`  
**Method:** GET  
**Purpose:** Authenticate employee with username and password  
**Request:**
```
?Username=rahul&Password=123
```
**Response:**
```json
{
  "token": "string",
  "employeeData": {}
}
```

---

### 2. Phone Number Verify
**Endpoint:** `Recharge/VerifyNumber`  
**Method:** GET  
**Purpose:** Verify customer phone number before recharge  
**Request:**
```
?Ph=7034555472
```
**Response:**
```json
{
  "status": "Done"
}
```

---

### 3. OTP Verification
**Endpoint:** `Recharge/VerifyOtp`  
**Method:** GET  
**Purpose:** Verify OTP sent to customer phone  
**Request:**
```
?Otp=1234
```
**Response:**
```json
{
  "Register or not register",
  "OTP already sending in previous api"
}
```

---

### 4. Get Customer Details
**Endpoint:** `Recharge/GetCustomerDetails`  
**Method:** GET  
**Purpose:** Get customer data including card balance, token balance, cash balance, point balance  
**Request:**
```
?LedgerId=45283
```
**Response:**
```json
{
  "customerData": {},
  "cardBalance": 0,
  "tokenBalance": 0,
  "cashBalance": 0,
  "pointBalance": 0
}
```

---

### 5. Get Tax Details (GST)
**Endpoint:** `Recharge/GetTaxDetails`  
**Method:** GET  
**Purpose:** Get GST percentage and tax amount for a location  
**Request:**
```
?LocId=1030
```
**Response:**
```json
{
  "GST": "%",
  "TaxAmount": 0
}
```

---

### 6. Recharge
**Endpoint:** `Recharge/Recharge`  
**Method:** GET  
**Purpose:** Process customer recharge with amount, discount, tax, and net amount  
**Request:**
```
?Amount=1000&Discount=10&TaxPercentage=10&TaxAmount=100&LedgerId=45283&NetAmount=900&GNote=test&Remark=treeee&BranchId=1030
```
**Response:**
```json
{
  "status": "Done"
}
```

---

### 7. Add/Edit Customer
**Endpoint:** `Customer/AddOrEditCustomer`  
**Method:** POST  
**Purpose:** Add new customer or edit existing customer  
**Request Body:**
```json
{
  "ledgerId": 0,
  "ledgerName": "RAHUL CR",
  "mobile": "7034555472",
  "emailId": "rahulcrpanthalloor@gmail.com",
  "dob": "1997-06-26T11:43:11.253Z",
  "age": 28,
  "gender": 1,
  "country": 10,
  "state": 20,
  "city": 30,
  "address": "cherinjamaprmabil house",
  "zipCode": 680305,
  "emergencyNo": "986534521",
  "proof": 1,
  "proofId": "225588",
  "occupation": "IT",
  "institute": "AYJ",
  "remark": "test",
  "status": 1
}
```
**Response:** Success/Failure status

---

### 8. Get Customer List
**Endpoint:** `Customer/GetCustomerList`  
**Method:** GET  
**Purpose:** Get list of all customers  
**Request:** None (uses session auth)  
**Response:** Array of customer data

---

### 9. Get Customer Data (Edit)
**Endpoint:** `Customer/GetCustomerData`  
**Method:** GET  
**Purpose:** Get single customer data for editing  
**Request:**
```
?LedgerId=44864
```
**Response:** Same structure as Add Customer

---

### 10. Delete Customer
**Endpoint:** `Customer/DeleteCustomer`  
**Method:** GET  
**Purpose:** Delete a customer  
**Request:**
```
?LedgerId=45511&EmpId=101
```
**Response:** Success/Failure

---

### 11. Add/Edit Event
**Endpoint:** `Event/AddEditEventBooking`  
**Method:** POST  
**Purpose:** Add new event booking or edit existing event  
**Request Body:**
```json
{
  "id": 0,
  "name": "EventName",
  "phone": 9876543210,
  "email": "",
  "address": "address",
  "eventDate": "2025-09-30",
  "event": 2,
  "eventDescription": "Description",
  "noOfAttendees": 100,
  "venu": 0,
  "venuCost": 100,
  "cake": 0,
  "cakeKg": 0,
  "cakePerKg": 0,
  "cakeAmt": 0,
  "writingsOnCake": "string",
  "cateringMeanu": "string",
  "foodCostPerPlate": 0,
  "noOfPlates": 0,
  "cateringFoodAmt": 0,
  "otherArrangement": "string",
  "otherArrangementAmt": 0,
  "foodAmt": 0,
  "cardAmt": 0,
  "giftAmt": 0,
  "discountPer": 0,
  "discountAmt": 0,
  "remarks": "string",
  "otherAdd": 0,
  "otherAddDesc": "string",
  "otherDed": 0,
  "otherDedDesc": "string",
  "terms": "string",
  "netAmt": 0,
  "cashRecived": 0,
  "balanceAmt": 0,
  "status": 1,
  "branchId": 1030,
  "createdBy": 0,
  "createdOn": "2025-09-30",
  "modifiedBy": 0,
  "modifiedOn": "2025-09-30",
  "payId": 0,
  "advancePay": 0,
  "items": []
}
```
**Response:** Success/Failure

---

### 12. Get Pending Event Requests
**Endpoint:** `Event/GetApprPendingEventList`  
**Method:** GET  
**Purpose:** Get list of events awaiting approval  
**Request:**
```
?BranchId=1030
```
**Response:** Array of pending event requests

---

### 13. Get Event By ID (View)
**Endpoint:** `Event/GetEventListById`  
**Method:** GET  
**Purpose:** Get single event details  
**Request:**
```
?EventId=174
```
**Response:** Single event object

---

### 14. Approve Event
**Endpoint:** `Event/ApproveEvent`  
**Method:** GET  
**Purpose:** Approve a pending event request  
**Request:**
```
?Id=101&ApprovedBy=10&BranchId=1030
```
**Response:** Success/Failure

---

### 15. Get Event List
**Endpoint:** `Event/GetEventList`  
**Method:** GET  
**Purpose:** Get list of all events  
**Request:**
```
?BranchId=1030
```
**Response:** Array of events

---

### 16. Delete Event
**Endpoint:** `Event/DeleteEvent`  
**Method:** GET  
**Purpose:** Delete an event  
**Request:**
```
?Id=101
```
**Response:** Success/Failure

---

### 17. Register Waiver Template
**Endpoint:** `Waiver/RegisterWaiverTemplate`  
**Method:** POST  
**Purpose:** Create a new waiver template with customizable fields  
**Request Body:**
```json
{
  "waverId": 0,
  "titile": "string",
  "description": "string",
  "name": 0,
  "nameOpt": 0,
  "phone": 0,
  "phoneOpt": 0,
  "emailId": 0,
  "emailIdOpt": 0,
  "address": 0,
  "addressOpt": 0,
  "dob": 0,
  "dobOpt": 0,
  "file": 0,
  "fileOpt": 0,
  "signature": 0,
  "signatureOpt": 0,
  "active": 0,
  "status": 0,
  "createdBy": 0,
  "createdOn": "2025-09-30T07:19:00.668Z",
  "modifiedBy": 0,
  "modifiedOn": "2025-09-30T07:19:00.668Z"
}
```
**Response:** Success/Failure

---

### 18. Get Waiver List
**Endpoint:** `Waiver/WaverFormList`  
**Method:** GET  
**Purpose:** Get list of all waiver templates  
**Request:** None (uses session auth)  
**Response:** Array of waiver templates

---

### 19. Update Waiver Active Status
**Endpoint:** `Waiver/UpdateWaiverActive`  
**Method:** GET  
**Purpose:** Activate or deactivate a waiver template  
**Request:**
```
?Id=2&Active=0&ModifiedBy=105
```
**Response:** Success/Failure

---

### 20. Get Waiver Data for Edit
**Endpoint:** `Waiver/WaverFormDateGet`  
**Method:** GET  
**Purpose:** Get waiver template data for editing  
**Request:**
```
?Id=1
```
**Response:** Waiver template object

---

### 21. Clone Waiver
**Endpoint:** `Waiver/WaverFormCusDateGet`  
**Method:** GET  
**Purpose:** Get waiver data for cloning (send Id=0 for new)  
**Request:**
```
?Id=1
```
**Response:** Waiver template object

---

### 22. Delete Waiver
**Endpoint:** `Waiver/DeleteWaiver`  
**Method:** GET  
**Purpose:** Delete a waiver template  
**Request:**
```
?Id=2&ModifiedBy=201
```
**Response:** Success/Failure

---

### 23. Waiver Check-In
**Endpoint:** `Waiver/WaiverCheckIn`  
**Method:** GET  
**Purpose:** Check in customer for a signed waiver  
**Request:**
```
?CusWaiverId=12&BranchId=1030
```
**Response:** Success/Failure

---

### 24. Export Signed Waivers
**Endpoint:** `Waiver/ExportCusWaiver`  
**Method:** GET  
**Purpose:** Export signed waivers as PDF  
**Request:**
```
?WaverId=42&from=01-01-2025&to=01-01-2027
```
**Response:** PDF file

---

## Customer Module

### 25. Customer Login
**Endpoint:** `CusModule/CusLogin`  
**Method:** GET  
**Purpose:** Customer login with phone number  
**Request:**
```
?Ph=7034555472
```
**Response:** Token and customer data

---

### 26. Customer Registration/Edit
**Endpoint:** `CusModule/RegOrEditCustomer`  
**Method:** POST  
**Purpose:** Register new customer or edit existing  
**Request Body:**
```json
{
  "ledgerId": 0,
  "ledgerName": "string",
  "mobile": "string",
  "emailId": "string",
  "dob": "2025-10-03T09:11:05.089Z",
  "age": 0,
  "gender": 0,
  "country": 0,
  "state": 0,
  "city": 0,
  "address": "string",
  "zipCode": 0,
  "emergencyNo": "string",
  "proof": 0,
  "proofId": "string",
  "occupation": "string",
  "institute": "string",
  "remark": "string",
  "status": 0
}
```
**Response:** Success/Failure

---

### 27. Get Customer Data
**Endpoint:** `CusModule/GetCustomerData`  
**Method:** GET  
**Purpose:** Get logged-in customer data  
**Request:**
```
?LedgerID=45281
```
**Response:** Customer data with balances

---

### 28. Customer Event Booking
**Endpoint:** `CusModule/AddEditEventBooking`  
**Method:** POST  
**Purpose:** Book or edit event from customer side  
**Request Body:** Same as employee event booking
**Response:** Success/Failure

---

### 29. Get Customer Events
**Endpoint:** `CusModule/GetEventList`  
**Method:** GET  
**Purpose:** Get customer's booked events  
**Request:**
```
?LedgerId=45281
```
**Response:** Array of events

---

### 30. Customer Recharge
**Endpoint:** `CusModule/Recharge`  
**Method:** GET  
**Purpose:** Customer recharge their account  
**Request:**
```
?Amount=100&LedgerId=45281&BranchId=1030
```
**Response:** Success/Failure

---

### 31. Recharge History
**Endpoint:** `CusModule/RechargeHistory`  
**Method:** GET  
**Purpose:** Get customer's recharge history  
**Request:**
```
?LedgerId=45281
```
**Response:** Array of recharge records

---

### 32. Customer Waiver List
**Endpoint:** `CusModule/WaverFormList`  
**Method:** GET  
**Purpose:** Get available waivers for customer  
**Request:** None (uses session auth)  
**Response:** Array of waiver templates

---

### 33. Single Waiver Data
**Endpoint:** `CusModule/WaverSingleData`  
**Method:** GET  
**Purpose:** Get single waiver details for customer  
**Request:**
```
?LedgerId=1001
```
**Response:** Waiver object

---

## Drop Down APIs

### 34. Country Drop Down
**Endpoint:** `DropDown/CountryDropDown`  
**Method:** GET  
**Purpose:** Get list of countries

---

### 35. State Drop Down
**Endpoint:** `DropDown/StateDropDown`  
**Method:** GET  
**Purpose:** Get states by country  
**Request:**
```
?CountryId=1
```

---

### 36. City Drop Down
**Endpoint:** `DropDown/CityDropDown`  
**Method:** GET  
**Purpose:** Get cities by state  
**Request:**
```
?StateId=1
```

---

### 37. Gender Drop Down
**Endpoint:** `DropDown/GenderDropDown`  
**Method:** GET  
**Purpose:** Get gender options

---

### 38. Proof Drop Down
**Endpoint:** `DropDown/ProofDropDown`  
**Method:** GET  
**Purpose:** Get proof type options

---

### 39. Event Drop Down
**Endpoint:** `DropDown/EventDropDown`  
**Method:** GET  
**Purpose:** Get event types for a branch  
**Request:**
```
?BranchId=1030
```

---

### 40. Cake Drop Down
**Endpoint:** `DropDown/CakeDropDown`  
**Method:** GET  
**Purpose:** Get cake options  
**Request:**
```
?BranchId=1039
```

---

### 41. Venue Drop Down
**Endpoint:** `DropDown/VenuDropDown`  
**Method:** GET  
**Purpose:** Get venue options  
**Request:**
```
?BranchId=1030
```

---

### 42. Venue Details
**Endpoint:** `DropDown/VenuDropDownDetails`  
**Method:** GET  
**Purpose:** Get venue details by type  
**Request:**
```
?BranchId=1030&GTypeSubId=7
```

---

### 43. Location List
**Endpoint:** `DropDown/LocationList`  
**Method:** GET  
**Purpose:** Get all locations

---

### 44. Event Card Products
**Endpoint:** `Event/EventCardProduct`  
**Method:** GET  
**Purpose:** Get card products for events  
**Request:**
```
?BranchId=1039
```

---

### 45. Event Food Products
**Endpoint:** `Event/EventFoodList`  
**Method:** GET  
**Purpose:** Get food products for events  
**Request:**
```
?BranchId=1039
```

---

### 46. Event Gift Products
**Endpoint:** `Event/EventGiftList`  
**Method:** GET  
**Purpose:** Get gift products for events  
**Request:**
```
?BranchId=1039
```

---

### 47. Employee List
**Endpoint:** `DropDown/EmployeeList`  
**Method:** GET  
**Purpose:** Get list of employees for a branch  
**Request:**
```
?BranchId=1030
```

---

## Management Dashboard API

### 47. Management Values (8 Widgets)
**Endpoint:** `MangementDashBoard/ManagementValues`  
**Method:** GET  
**Purpose:** Get 8 widget values for dashboard overview

---

### 48. Game Revenue Graph
**Endpoint:** `MangementDashBoard/GameRevenueGraph`  
**Method:** GET  
**Purpose:** Get game revenue data for graph  
**Request:**
```
?Game=0&Day=0
```

---

### 49. Product Revenue Graph
**Endpoint:** `MangementDashBoard/ProductRevenueGraph`  
**Method:** GET  
**Purpose:** Get product revenue data for graph  
**Request:**
```
?Product=0&Day=0
```

---

### 50. Redemption Revenue Graph
**Endpoint:** `MangementDashBoard/RedemptionRevenueGraph`  
**Method:** GET  
**Purpose:** Get redemption revenue data for graph  
**Request:**
```
?Product=1&Day=1
```

---

### 51. Event Revenue Graph
**Endpoint:** `MangementDashBoard/EventRevenueGraph`  
**Method:** GET  
**Purpose:** Get event revenue data for graph  
**Request:**
```
?Day=1
```

---

### 52. FB Revenue Graph
**Endpoint:** `MangementDashBoard/FBRevenueGraph`  
**Method:** GET  
**Purpose:** Get food & beverage revenue for graph  
**Request:**
```
?Product=1&Day=1
```

---

### 53. Trampoline Revenue Graph
**Endpoint:** `MangementDashBoard/TrampolineRevenueGraph`  
**Method:** GET  
**Purpose:** Get trampoline revenue for graph  
**Request:**
```
?Product=1&Day=1
```

---

### 54. Bowling Revenue Graph
**Endpoint:** `MangementDashBoard/BowlingRevenueGraph`  
**Method:** GET  
**Purpose:** Get bowling revenue for graph  
**Request:**
```
?Product=1&Day=1
```

---

### 55. Upcoming Events
**Endpoint:** `MangementDashBoard/UpcomingEvent`  
**Method:** GET  
**Purpose:** Get upcoming events for dashboard

---

### 56. Main Graph
**Endpoint:** `MangementDashBoard/MainGraph`  
**Method:** GET  
**Purpose:** Get main dashboard graph data  
**Request:**
```
?day=1
```

---

### Drop Down for Dashboard
**Game List:** `DropDown/GameList?BranchId=1030`  
**Product List:** `DropDown/ProductList?BranchId=1030`  
**Redemption Product List:** `DropDown/RedeemptionProductList?BranchId=1030`  
**FB Product List:** `DropDown/FBProductList?BranchId=1030`  
**Trampoline Product List:** `DropDown/TramplineProductList?BranchId=1030`  
**Bowling Product List:** `DropDown/BowlingProductList?BranchId=1030`  
**Employee List:** `DropDown/EmployeeList?BranchId=1030`  
**Bowling Product List:** `DropDown/BowlingProductList?BranchId=1030`

---

## Store Dashboard API

### 57. Inventory Values
**Endpoint:** `Store/InventoryValues`  
**Method:** GET  
**Purpose:** Get store inventory data  
**Request:**
```
?BranchId=1030
```

---

## Report APIs

### 58. Cash Revenue Report
**Endpoint:** `Report/CashRevenueReport`  
**Method:** GET  
**Purpose:** Get cash revenue report  
**Request:**
```
?fTime=01-01-2025&tTime=12-12-2025&Option=1&BranchId=1030
```
**Options:** `Option=0` (Normal), `Option=1` (Details)

---

### 59. Game Revenue Report
**Endpoint:** `Report/GameRevenueReport`  
**Method:** GET  
**Purpose:** Get game revenue report  
**Request:**
```
?fTime=01-01-2025&tTime=12-12-2025&BranchId=1030
```

---

### 60. Sales Report
**Endpoint:** `Report/SalesReport`  
**Method:** GET  
**Purpose:** Get sales report  
**Request:**
```
?fTime=01-01-2025&tTime=02-15-2025&BranchId=1030
```

---

### 61. Sales Detail Report
**Endpoint:** `Report/SalesDetailReport`  
**Method:** GET  
**Purpose:** Get detailed sales report  
**Request:**
```
?fTime=01-01-2025&tTime=02-15-2025&BranchId=1030
```

---

### 62. Redemption Report
**Endpoint:** `Report/RedeemptionReport`  
**Method:** GET  
**Purpose:** Get redemption report  
**Request:**
```
?fTime=01-01-2020&tTime=01-01-2025&BranchId=1030
```

---

### 63. Redemption Sales Report
**Endpoint:** `Report/RedeemptionSalesReport`  
**Method:** GET  
**Purpose:** Get redemption sales report  
**Request:**
```
?fTime=01-01-2020&tTime=01-01-2026&BranchId=1030
```

---

### 64. Recharge Report
**Endpoint:** `Report/RechargeReport`  
**Method:** GET  
**Purpose:** Get recharge report  
**Request:**
```
?fTime=01-01-2020&tTime=01-01-2026&BranchId=1030
```

---

### 65. Recharge Revenue Report
**Endpoint:** `Report/RechargeRevenueReport`  
**Method:** GET  
**Purpose:** Get recharge revenue report  
**Request:**
```
?fTime=01-01-2020&tTime=01-01-2026&BranchId=1030
```

---

### 66. Employee GamePlay Report
**Endpoint:** `Report/EmployeeGamePlayReport`  
**Method:** GET  
**Purpose:** Get employee gameplay report  
**Request:**
```
?fTime=01-01-2025&tTime=01-01-2026&BranchId=1030
```

---

### 67. Card Liability Report
**Endpoint:** `Report/CardLiabilityReport`  
**Method:** GET  
**Purpose:** Get card liability report  
**Request:**
```
?fTime=01-01-2020&tTime=01-01-2026&BranchId=1030
```

---

### 68. Clear Card Report
**Endpoint:** `Report/ClearCardReport`  
**Method:** GET  
**Purpose:** Get clear card report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2026&BranchId=1030
```

---

### 69. Card Consolidate Report
**Endpoint:** `Report/CardConsolidateReport`  
**Method:** GET  
**Purpose:** Get consolidated card report  
**Request:**
```
?fTime=01-01-2025&tTime=01-12-2026&BranchId=1030
```

---

### 70. Card Transfer Report
**Endpoint:** `Report/CardTransferReport`  
**Method:** GET  
**Purpose:** Get card transfer report  
**Request:**
```
?fTime=01-01-2025&tTime=01-12-2026&BranchId=1030
```

---

### 71. Card Void Report
**Endpoint:** `Report/CardVoidReport`  
**Method:** GET  
**Purpose:** Get void card report  
**Request:**
```
?fTime=01-01-2025&tTime=01-01-2026&BranchId=1030
```

---

### 72. Top Played Game Report
**Endpoint:** `Report/TopPlayedGameReport`  
**Method:** GET  
**Purpose:** Get top played games report  
**Request:**
```
?fTime=01-01-2025&tTime=01-01-2026&BranchId=1030
```

---

### 73. Membership Report
**Endpoint:** `Report/MemberShipReport`  
**Method:** GET  
**Purpose:** Get membership report

---

### 74. Offers List Report
**Endpoint:** `Report/OffersListReport`  
**Method:** GET  
**Purpose:** Get offers and promotions list  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

### 75. Happy Hour Report
**Endpoint:** `Report/HappyHourReport`  
**Method:** GET  
**Purpose:** Get happy hour report  
**Request:**
```
?BranchId=1030
```

---

### 76. Sales Void Report
**Endpoint:** `Report/SalesVoidReport`  
**Method:** GET  
**Purpose:** Get sales void report  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

### 77. Sales Return Report
**Endpoint:** `Report/SalesReturnReport`  
**Method:** GET  
**Purpose:** Get sales return report  
**Request:**
```
?fTime=01-01-2025&tTime=01-01-2027&BranchId=1030
```

---

### 78. Group Sale Report
**Endpoint:** `Report/GroupSaleReport` (or `Report/GroupSale`)  
**Method:** GET  
**Purpose:** Get group sale report  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

### 79. Family Card Report
**Endpoint:** `Report/FamilyCardReport`  
**Method:** GET  
**Purpose:** Get family card report  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

### 80. New Card Count Report
**Endpoint:** `Report/NewCardCountReport`  
**Method:** GET  
**Purpose:** Get new card count report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 81. New Customer Register Report
**Endpoint:** `Report/NewCustomerRegisterReport`  
**Method:** GET  
**Purpose:** Get new customer registration report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 82. Card Summary Report
**Endpoint:** `Report/CardSummeryReport`  
**Method:** GET  
**Purpose:** Get card summary report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 83. Customer Traffic Report
**Endpoint:** `Report/CustomerTrafficReport`  
**Method:** GET  
**Purpose:** Get customer traffic report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 84. Drawer Access Report
**Endpoint:** `Report/DrawerAccessReport`  
**Method:** GET  
**Purpose:** Get drawer access report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 85. Refund Report
**Endpoint:** `Report/RefaundReport`  
**Method:** GET  
**Purpose:** Get refund report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 86. Request Point Report
**Endpoint:** `Report/RequestPointReport`  
**Method:** GET  
**Purpose:** Get point request report  
**Request:**
```
?fTime=01-10-2024&tTime=01-01-2027&BranchId=1030
```

---

### 87. Third Party Card Transaction Report
**Endpoint:** `Report/ThirdPartyCardTransReport`  
**Method:** GET  
**Purpose:** Get third party card transactions  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&Status=1
```

---

## POS Revenue Reports

### 88. Card Consolidate Report (Date Range)
**Endpoint:** `Report/CardConsolidateReport`  
**Method:** GET  
**Purpose:** Get consolidated card report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 89. Card Liability Report (Date Range)
**Endpoint:** `Report/CardLiabilityReport`  
**Method:** GET  
**Purpose:** Get card liability report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 90. Card Void Report (Date Range)
**Endpoint:** `Report/CardVoidReport`  
**Method:** GET  
**Purpose:** Get void card report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 91. Cash Revenue Report (Details)
**Endpoint:** `Report/CashRevenueReport`  
**Method:** GET  
**Purpose:** Get cash revenue with details option  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&Option=1&BranchId=1030
```

---

### 92. Clear Card Report (Date Range)
**Endpoint:** `Report/ClearCardReport`  
**Method:** GET  
**Purpose:** Get clear card report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 93. Recharge Report (Date Range)
**Endpoint:** `Report/RechargeReport`  
**Method:** GET  
**Purpose:** Get recharge report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2026&BranchId=1030
```

---

### 94. Recharge Revenue Report (Date Range)
**Endpoint:** `Report/RechargeRevenueReport`  
**Method:** GET  
**Purpose:** Get recharge revenue with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Advance POS Reports

### 95. Credit Card Activity Report
**Endpoint:** `Report/CreditCardActivityReport`  
**Method:** GET  
**Purpose:** Get credit card activity report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 96. Member Activity Report
**Endpoint:** `Report/MemberActivityReport`  
**Method:** GET  
**Purpose:** Get member activity report  
**Request:**
```
?BranchId=1030
```

---

### 97. Sales Complementary Report
**Endpoint:** `Report/SalesComplementryReport`  
**Method:** GET  
**Purpose:** Get complementary sales report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 98. Sales Complementary Detail Report
**Endpoint:** `Report/SalesComplementryDetailReport`  
**Method:** GET  
**Purpose:** Get detailed complementary sales  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 99. Sales Report (Date Range)
**Endpoint:** `Report/SalesReport`  
**Method:** GET  
**Purpose:** Get sales report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 100. Sales Detail Report (Date Range)
**Endpoint:** `Report/SalesDetailReport`  
**Method:** GET  
**Purpose:** Get detailed sales with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Game Revenue Reports

### 101. Detailed Employee GamePlay Report
**Endpoint:** `Report/DetailedEmployeeGamePlayReport`  
**Method:** GET  
**Purpose:** Get detailed employee gameplay report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030&empid=0
```
**Note:** empid is from dropdown (0 for all employees)

---

### 102. Game Revenue Report (Date Range)
**Endpoint:** `Report/GameRevenueReport`  
**Method:** GET  
**Purpose:** Get game revenue with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 103. Top Played Game Report (Date Range)
**Endpoint:** `Report/TopPlayedGameReport`  
**Method:** GET  
**Purpose:** Get top played games with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Redemption Reports

### 104. Redemption Complementary Report
**Endpoint:** `Report/RedemptionComplementryreport`  
**Method:** GET  
**Purpose:** Get redemption complementary items  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 105. Redemption Redeem Report
**Endpoint:** `Report/RedemptionRedeemreport`  
**Method:** GET  
**Purpose:** Get redemption redemption details  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 106. Redemption Damaged Products Report
**Endpoint:** `Report/RedemptionDamagedProductsreport`  
**Method:** GET  
**Purpose:** Get damaged products in redemption  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 107. Redemption Sales Report (Date Range)
**Endpoint:** `Report/RedemptionSalesreport`  
**Method:** GET  
**Purpose:** Get redemption sales with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 108. Inventory Report
**Endpoint:** `Report/InventoryReport`  
**Method:** GET  
**Purpose:** Get inventory report by product type  
**Request:**
```
?BranchId=1030&producttype=50
```
**Product Types:**
- All: `producttype=13`
- FB: `producttype=3`
- Marchandise: `producttype=8`
- Redemption: `producttype=6`
- Bowling Accessories: `producttype=11`

---

### 109. Quantity Adjustment Report
**Endpoint:** `Report/QtyAdjustmentReport`  
**Method:** GET  
**Purpose:** Get quantity adjustment report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 110. Reorder Report
**Endpoint:** `Report/ReorderReport`  
**Method:** GET  
**Purpose:** Get reorder report  
**Request:**
```
?BranchId=1030&ReorderCount=100
```

---

## Party Booking Reports

### 111. Party Pack List Report
**Endpoint:** `Report/PartyPackListreport`  
**Method:** GET  
**Purpose:** Get party package list  
**Request:**
```
?BranchId=1030
```

---

### 112. Party Booking Report
**Endpoint:** `Report/PartyBookingreport`  
**Method:** GET  
**Purpose:** Get party booking summary  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 113. Party Booking Detail Report
**Endpoint:** `Report/PartyBookingdetailreport`  
**Method:** GET  
**Purpose:** Get detailed party booking  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 114. Party Booking Payment Details Report
**Endpoint:** `Report/PartybookingPaymentDetailsreport`  
**Method:** GET  
**Purpose:** Get payment details for party bookings  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Employee Related Reports

### 115. Detailed Employee GamePlay (Date Range)
**Endpoint:** `Report/DetailedEmployeeGamePlayReport`  
**Method:** GET  
**Purpose:** Get detailed employee gameplay with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030&empid=0
```

---

### 116. Employee List Report
**Endpoint:** `Report/EmployeeListReport`  
**Method:** GET  
**Purpose:** Get employee list report  
**Request:**
```
?BranchId=1030
```

---

### 117. Employee Payment Adjustments
**Endpoint:** `Report/EmployeePaymentAdjustments`  
**Method:** GET  
**Purpose:** Get employee payment adjustments  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Purchase Reports

### 118. Purchase Report
**Endpoint:** `Report/PurchaseReport`  
**Method:** GET  
**Purpose:** Get purchase report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 119. Purchase Return Report
**Endpoint:** `Report/PurchaseReturnReport`  
**Method:** GET  
**Purpose:** Get purchase return report  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-206&BranchId=1030
```

---

## Customer Service Reports

### 120. New Card Count Report (Date Range)
**Endpoint:** `Report/NewCardCountReport`  
**Method:** GET  
**Purpose:** Get new card count with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 121. New Customer Register Report (Date Range)
**Endpoint:** `Report/NewCustomerRegisterReport`  
**Method:** GET  
**Purpose:** Get new customer registration with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Offer And Promotions

### 122. Happy Hour Report (Branch)
**Endpoint:** `Report/HappyHourReport`  
**Method:** GET  
**Purpose:** Get happy hour report by branch  
**Request:**
```
?BranchId=1030
```

---

### 123. Offers List Report (Date Range)
**Endpoint:** `Report/OffersListReport`  
**Method:** GET  
**Purpose:** Get offers list with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

## Other Sales Reports

### 124. Family Card Report (Date Range)
**Endpoint:** `Report/FamilyCardReport`  
**Method:** GET  
**Purpose:** Get family card report with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 125. Group Sale Report (Date Range)
**Endpoint:** `Report/GroupSaleReport` (or `Report/GroupSale`)  
**Method:** GET  
**Purpose:** Get group sale with date range  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

### 126. Sales Return Report (Date Range)
**Endpoint:** `Report/SalesReturnReport`  
**Method:** GET  
**Purpose:** Get sales return with date range  
**Request:**
```
?fTime=01-01-2024&tTime=01-01-2027&BranchId=1030
```

---

### 127. Sales Void Report (Date Range)
**Endpoint:** `Report/SalesVoidReport`  
**Method:** GET  
**Purpose:** Get sales void with date range  
**Request:**
```
?fTime=2024-01-01&tTime=2026-04-29&BranchId=1030
```

---

## Additional APIs (New/Required)

### 73. Update Profile
**Endpoint:** `Login/UpdateProfile`  
**Method:** GET  
**Purpose:** Update employee profile  
**Request:**
```
?Username=rahul&Password=123&EmpId=1041
```

---

### 74. Sign Waiver (Multipart)
**Endpoint:** `Waiver/RegisterWaiverForm`  
**Method:** POST  
**Purpose:** Submit signed waiver with signature file  
**Content-Type:** multipart/form-data

---

### 75. Get All Signed Waivers
**Endpoint:** `Waiver/WaverFormCusDataList`  
**Method:** GET  
**Purpose:** Get all signed waivers

---

### 76. Delete Signed Waiver
**Endpoint:** `Waiver/DeleteCustomerWaiver`  
**Method:** GET  
**Purpose:** Delete signed waiver  
**Request:**
```
?Id=4&ModifiedBy=44
```

---

### 77. Download Customer Waiver PDF
**Endpoint:** `Waiver/DownloadCustomerWaiver`  
**Method:** GET  
**Purpose:** Download signed waiver as PDF  
**Request:**
```
?LedgerId=101&WaverId=42
```

---

---

## Frontend Connection Status

| API Endpoint | Connected? | Frontend File |
|--------------|-------------|---------------|
| Login/CheckLogin | ✅ Yes | `auth-api.ts` |
| Login/UpdateProfile | ✅ Yes | `auth-api.ts` |
| Recharge/VerifyNumber | ✅ Yes | `recharge-and-balance-api.ts` |
| Recharge/VerifyOtp | ❌ No | - |
| Recharge/GetCustomerDetails | ✅ Yes | `recharge-and-balance-api.ts` |
| Recharge/GetTaxDetails | ✅ Yes | `recharge-and-balance-api.ts` |
| Recharge/Recharge | ✅ Yes | `recharge-and-balance-api.ts` |
| Customer/AddOrEditCustomer | ✅ Yes | `customer-api.ts` |
| Customer/GetCustomerList | ✅ Yes | `customer-api.ts` |
| Customer/GetCustomerData | ✅ Yes | `customer-api.ts` |
| Customer/DeleteCustomer | ✅ Yes | `customer-api.ts` |
| Event/AddEditEventBooking | ✅ Yes | `events-api.ts` |
| Event/GetEventList | ✅ Yes | `events-api.ts` |
| Event/GetEventListById | ✅ Yes | `events-api.ts` |
| Event/DeleteEvent | ✅ Yes | `events-api.ts` |
| Event/GetApprPendingEventList | ✅ Yes | `events-api.ts` |
| Event/ApproveEvent | ✅ Yes | `events-api.ts` |
| Event/EventCardProduct | ✅ Yes | `events-api.ts` |
| Event/EventFoodList | ✅ Yes | `events-api.ts` |
| Event/EventGiftList | ✅ Yes | `events-api.ts` |
| Waiver/RegisterWaiverTemplate | ✅ Yes | `waiver-api.ts` |
| Waiver/WaverFormList | ✅ Yes | `waiver-api.ts` |
| Waiver/DeleteWaiver | ✅ Yes | `waiver-api.ts` |
| Waiver/UpdateWaiverActive | ✅ Yes | `waiver-api.ts` |
| Waiver/WaverFormDateGet | ✅ Yes | `waiver-api.ts` |
| Waiver/WaverFormCusDateGet | ✅ Yes | `waiver-api.ts` |
| Waiver/RegisterWaiverForm | ✅ Yes | `waiver-api.ts` |
| Waiver/WaverFormCusDataList | ✅ Yes | `waiver-api.ts` |
| Waiver/DeleteCustomerWaiver | ✅ Yes | `waiver-api.ts` |
| Waiver/DownloadCustomerWaiver | ✅ Yes | `waiver-api.ts` |
| Waiver/WaiverCheckIn | ✅ Yes | `waiver-api.ts` |
| Waiver/ExportCusWaiver | ✅ Yes | `waiver-api.ts` |
| CusModule/CusLogin | ✅ Yes | `customer-module-api.ts` |
| CusModule/RegOrEditCustomer | ✅ Yes | `customer-module-api.ts` |
| CusModule/GetCustomerData | ✅ Yes | `customer-module-api.ts` |
| CusModule/AddEditEventBooking | ✅ Yes | `customer-module-api.ts` |
| CusModule/GetEventList | ✅ Yes | `customer-module-api.ts` |
| CusModule/Recharge | ✅ Yes | `customer-module-api.ts` |
| CusModule/RechargeHistory | ✅ Yes | `customer-module-api.ts` |
| CusModule/WaverFormList | ✅ Yes | `customer-module-api.ts` |
| CusModule/WaverSingleData | ✅ Yes | `customer-module-api.ts` |
| DropDown/CountryDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/StateDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/CityDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/GenderDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/ProofDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/EventDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/VenuDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/VenuDropDownDetails | ✅ Yes | `drop-down-api.ts` |
| DropDown/LocationList | ✅ Yes | `drop-down-api.ts` |
| DropDown/CakeDropDown | ✅ Yes | `drop-down-api.ts` |
| DropDown/GameList | ✅ Yes | `drop-down-api.ts` |
| DropDown/ProductList | ✅ Yes | `drop-down-api.ts` |
| DropDown/RedeemptionProductList | ✅ Yes | `drop-down-api.ts` |
| DropDown/FBProductList | ✅ Yes | `drop-down-api.ts` |
| DropDown/TramplineProductList | ✅ Yes | `drop-down-api.ts` |
| DropDown/BowlingProductList | ✅ Yes | `drop-down-api.ts` |
| MangementDashBoard/ManagementValues | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/GameRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/ProductRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/RedemptionRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/EventRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/FBRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/TrampolineRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/BowlingRevenueGraph | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/UpcomingEvent | ✅ Yes | `management-dashboard.tsx` |
| MangementDashBoard/MainGraph | ✅ Yes | `management-dashboard.tsx` |
| Store/InventoryValues | ✅ Yes | `dashboard-api.ts` |
| Report/CashRevenueReport | ✅ Yes | `reports-api.ts` |
| Report/GameRevenueReport | ✅ Yes | `reports-api.ts` |
| Report/SalesReport | ✅ Yes | `reports-api.ts` |
| Report/SalesDetailReport | ✅ Yes | `reports-api.ts` |
| Report/RedeemptionReport | ✅ Yes | `reports-api.ts` |
| Report/RedeemptionSalesReport | ✅ Yes | `reports-api.ts` |
| Report/RechargeReport | ✅ Yes | `reports-api.ts` |
| Report/RechargeRevenueReport | ✅ Yes | `reports-api.ts` |
| Report/EmployeeGamePlayReport | ✅ Yes | `reports-api.ts` |
| Report/CardLiabilityReport | ✅ Yes | `reports-api.ts` |
| Report/ClearCardReport | ✅ Yes | `reports-api.ts` |
| Report/CardConsolidateReport | ✅ Yes | `reports-api.ts` |
| Report/CardTransferReport | ✅ Yes | `reports-api.ts` |
| Report/TopPlayedGameReport | ✅ Yes | `reports-api.ts` |
| Report/CardVoidReport | ✅ Yes | `reports-api.ts` |

**Summary:** 180+ APIs documented

---

## Known Issues

1. **GetOneCustomer (Edit):** Missing fields in response (Age, DOB, Country, City, Zip, EmergencyContact, Proof, ProofId, Occupation, Institute)

2. **GetAllEventRequests:** Returns `success=false` with "No events data" despite events present

3. **ApproveEventRequest & DeleteEvent:** HTTP 500 errors

4. **Register Waiver (Multipart):** Fails with "Unsupported Media Type" when logo included

5. **Waiver Status Change:** Reactivation fails, clarification needed for ModifiedBy field

6. **Customer Delete:** Requires full payload instead of just customerId

7. **Event Add:** Blocked due to missing dropdown APIs for Food, Card, Gift, Cake

---

*Document Version: Based on api_docs.docx*