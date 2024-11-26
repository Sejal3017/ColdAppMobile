# React Native MERN Expo Application
This project is a MERN stack application with a React Native Expo frontend and a Node.js + Express backend. Follow the instructions below to set up and run the project.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (Version 14 or later)
- [Git](https://git-scm.com/)

Here's how to format your setup instructions using Markdown with proper code block syntax and structure:

---

## Getting Started

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Sejal3017/ColdAppMobile.git
```

Navigate into the project directory:

```bash
cd ColdAppDemo
```

### 2. Setting Up the Backend

Go to the `backend` directory:

```bash
cd backend
```

Install the necessary dependencies:

```bash
npm install
```


Start the backend server:

```bash
nodemon app
```

You should see the message: `Server is running on port 5001` if the backend server starts successfully.

### 3. Setting Up the Frontend

Go to the `frontend` directory:

```bash
cd ../frontend
```

Install the dependencies:

```bash
npm install
```

Create the `.env` file in the `frontend` directory with the following variable:

```makefile
echo "EXPO_PUBLIC_BASE_URL=http://<YOUR IP ADDRESS>:5001" > .env
```

**Note**: Replace `<YOUR IP ADDRESS>` with your local machine's IP address. You can find it using `ipconfig` on Windows or `ifconfig` on Mac/Linux. It should be in the format of `192.168.xx.xx` or similar.

### 4. Running the Frontend

Start the Expo development server:

```bash
npx expo start -c
```

This will open a QR code on your terminal. You can scan this QR code using the **Expo Go** app on your iPhone.

### 5. Testing the Application

1. Make sure your iPhone and the development machine are on the same Wi-Fi network.
2. Open the **Expo Go** app and scan the QR code displayed in the terminal.
3. The app should load on your device, connecting to the backend server running on your machine.

