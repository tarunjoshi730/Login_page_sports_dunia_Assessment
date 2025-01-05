# Vendor Management System
  Next Phase: https://tarunjoshi730.github.io/Sports_Duniyaa_Assessment_Diffrent_Create/
## Overview

This application is a Vendor Management System that provides functionalities to manage vendors, purchase orders, and historical performance data. It is built using Node.js and Express.js And MySql.

## Features

- **Vendor Management:** Create, read, update, and delete vendor information.
- **Purchase Orders:** Manage purchase orders with functionalities to create, read, update, and delete orders.
- **Historical Performance:** Track and manage historical performance data for vendors.

## Installation

### Steps

1. **Clone the Repository**

    ```bash
    git clone https://github.com/tarunjoshi730/Login_page_sports_dunia_Assessment.git
    hosting site: https://tarunjoshi730.github.io/Login_page_sports_dunia_Assessment/
    cd Sports_Dunia_Assessment
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Start the Application**

    ```bash
    npm start
    ```

    By default, the application will start on `http://localhost:3000`.
   <div> 
   <img src="https://github.com/user-attachments/assets/a074b201-7ecf-4342-a7ee-30fed3fe4dc8" width="600" height="300px">
  </div>


## API Endpoints

### Vendor Routes

- **Create a Vendor**
  - `POST /api/vendors`
  - Request Body: JSON with vendor details
  - Example: `{ "name": "Vendor Name", "contactDetails": "Contact Info", "address": "Vendor Address", "onTimeDeliveryRate": 95.5, "qualityRatingAvg": 4.7, "averageResponseTime": 2.5, "fulfillmentRate": 9.8 }`
  <br/>
  <div> 
   <img src="https://github.com/user-attachments/assets/6080eb7e-a28f-4110-b7c6-98d9bb4b1654" width="350" height="450px">
  </div>


- **List Vendors**
  - `GET /api/vendors`
  
- **Get Vendor by ID**
  - `GET /api/vendors/:vendorId`
  - Path Parameter: `vendorId` (integer)

- **Update Vendor**
  - `PUT /api/vendors/:vendorId`
  - Path Parameter: `vendorId` (integer)
  - Request Body: JSON with updated vendor details

- **Delete Vendor**
  - `DELETE /api/vendors/:vendorId`
  - Path Parameter: `vendorId` (integer)

### Purchase Order Routes

- **Create a Purchase Order**
  - `POST /api/purchase-orders`
  - Request Body: JSON with purchase order details
  - Example: `{ "vendorId": 1, "orderDate": "2024-08-20", "deliveryDate": "2024-09-01", "items": "Item A, Item B", "quantity": 100, "status": "pending", "qualityRating": 4.5, "issueDate": "2024-08-20", "acknowledgmentDate": "2024-08-21" }`
  <br/>
  <div> 
   <img src="https://github.com/user-attachments/assets/07f371c2-b699-462f-9b60-67fafd652781" width="400" height="550px">
  </div>


- **List Purchase Orders**
  - `GET /api/purchase-orders`
  
- **Get Purchase Order by ID**
  - `GET /api/purchase-orders/:poId`
  - Path Parameter: `poId` (integer)

- **Update Purchase Order**
  - `PUT /api/purchase-orders/:poId`
  - Path Parameter: `poId` (integer)
  - Request Body: JSON with updated purchase order details

- **Delete Purchase Order**
  - `DELETE /api/purchase-orders/:poId`
  - Path Parameter: `poId` (integer)

### Historical Performance Routes

- **Create Historical Performance Data**
  - `POST /api/historical_performance`
  - Request Body: JSON with historical performance data
  - Example: `{ "vendorId": 1, "date": "2024-08-20", "onTimeDeliveryRate": 95.5, "qualityRatingAvg": 4.7, "averageResponseTime": 2.5, "fulfillmentRate": 98 }`

  <br/>
  <div> 
   <img src="https://github.com/user-attachments/assets/1a927b2b-1bd0-41be-b7df-e5f927b04787" width="350" height="450px">
  </div>
  

- **Get Historical Performance by Vendor ID**
  - `GET /api/historical_performance/vendor/:vendorId`
  - Path Parameter: `vendorId` (integer)

- **Update Historical Performance Data**
  - `PUT /api/historical_performance/:performanceId`
  - Path Parameter: `performanceId` (integer)
  - Request Body: JSON with updated historical performance data

- **Delete Historical Performance Data**
  - `DELETE /api/historical_performance/:performanceId`
  - Path Parameter: `performanceId` (integer)
 
   ### Environment Variables

    - **Purpose:** Environment variables are used to store sensitive information securely and can be configured in a `.env` file or through your deployment environment.

    - **Example:**
   <div> 
   <img src="https://github.com/user-attachments/assets/8b1f1af0-1e33-4542-9597-4651591964c3" width="400" height="200px">
  </div>

## Error Handling

Errors are handled by middleware and logged using a logging configuration. If an error occurs, a JSON response with status `500` and an error message is returned.



