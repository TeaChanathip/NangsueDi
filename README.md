# NangsueDi

NangsueDi is an online library management system built with Angular 17 for the frontend, NestJS for the backend, and MongoDB as the database.

## Features

### User
- **Register**: Create a new account.
- **Forgot Password**: Request a password reset.
- **Reset Password**: Reset your password using the provided link.
- **Login**: Sign in to your account.
- **Logout**: Sign out from your account.
- **Change Password**: Update your account password.
- **Edit Profile**: Modify your personal information.
- **Search Books**: Look for books in the library.
- **Borrow Books**: Request to borrow books.
- **Return Books**: Request to return borrowed books.
- **Cancel Borrow Books**: Withdraw your borrow request.
- **Cancel Return Books**: Withdraw your return request.

### Manager
- **Register Books**: Add new books to the library.
- **Delete Books**: Remove books from the library.
- **Approve Borrow Requests**: Confirm users’ borrow requests.
- **Approve Return Requests**: Confirm users’ return requests.

### Admin
- **All Manager Features**: Full access to manager functionalities.
- **Manage Users**: Administer user accounts and roles.
- **Dashboard**: View library statistics and metrics.

## How to Use

### 1. Clone the Repository
First, clone the NangsueDi repository to your local machine:
```bash
git clone https://github.com/TeaChanathip/NangsueDi.git
```

### 2. Install Dependencies
Navigate into the project directory and install all necessary dependencies using Yarn:
```bash
cd NangsueDi
yarn
```

### 3. Set Up MongoDB for Transactions
Ensure your MongoDB is configured to support transactions. You can refer to [this guide on DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-transactions-in-mongodb) for instructions.

### 4. Configure Environment Variables for the Backend
Create a `.env` file in the `service` package. Refer to the provided [.env.example](./packages/service/.env.example) file for guidance. The following variables are required:
- **Email Provider**: For sending password reset emails.
- **MongoDB URI**: Connection string to your MongoDB database.
- **JWT Secret Key**: Used for signing JWTs (can be any string).

### 5. Configure Environment Variables for the Frontend
Create an `environment.ts` file in the `client` package. Refer to the provided [environment.example.ts](./packages/client/src/environments/environment.example.ts) file for guidance. Ensure that the configurations, especially the port numbers, match between the client and service.

### 6. Start the Application
Start both the client and the service by running the following commands from the project root directory:
```bash
yarn start:client
yarn start:service
```

### 7. Access the Application
Open your browser and go to the client URL (default: `http://localhost:4200`).

### 8. Register a New User
Create a new user account. This user will initially have basic privileges.

### 9. Promote a User to Admin
To promote your newly registered user to an Admin:
1. Open your MongoDB GUI tool (e.g., MongoDB Compass, Robo 3T).
2. Navigate to the `User` collection and find your newly registered user.
3. Change the `role` field of this user to `'ADMIN'`.

### 10. Verify Admin Access
Log in with the admin account. If you see the "Manage Users" menu in the navigation bar, the role change was successful.

### 11. Enjoy!
You’re now ready to explore and use the NangsueDi web application. Have fun!
