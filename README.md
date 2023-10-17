# Chit-chat

Chit-Chat is a modern web application built with TypeScript, Next.js, MongoDB, Tailwind CSS, Node.js, and ShadcnUI. It offers a seamless chatting experience with advanced features such as authentication, live chat messaging, online/offline status, typing status, attachment support, and emoji support for both private and group chats.

## Features

- Authentication => Secure user authentication system to protect user data and privacy.
   
- Live Chat Messaging=> Real-time messaging for instant communication between users.

-  Online & Offline Status=> Display users' online or offline status to indicate their availability.

- Typing Status=> Visual indicators for when someone is typing a message.
 
- Attachment Support=> Share files, images, and documents effortlessly within the chat.

- Dark Mode Support => Enhance your experience with dark mode support, reducing eye strain during late-night work sessions and providing a modern aesthetic touch.

-  Emoji Support=>Express emotions better with a wide range of emojis available for use.

- Private and Group Chat => Engage in one-on-one private conversations or create group chats for collaborative discussions.


## Installation

1. Clone this repository to your local machine using the below command.

```bash
git clone https://github.com/Hayat4144/chit-chat.git
```
2. Navigate to the project directory using the following command.

```bash
cd chit-chat
```

3. Install the backend dependencies using the command

```bash
npm install
```

4. Move to the client folder to install frontend dependencies 

```bash
cd client && pnpm install
```

5. Move back to base folder

```bash
cd ..
```

5. Start the development server , the below command start both server backend and frontend

```bash
npm run dev
```

6.  Open your browser and navigate to http://localhost:3000 to view the app
## Requirement
You have to install some additional tool into your machine for processing files and images.

you have to install imagemagick and graphicsmagick tool

```bash
brew install imagemagick
```

```bash
brew install graphicsmagick
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file .

Create .env file in the base directory and add these following environment variables to it

`NODE_ENV` environment for your node application

`JWT_SECRET` secret key for jwt

`CLOUDINARY_API_SECRET` cloudinary api secret key

`CLOUDINARY_API_KEY` cloudinary api key

`CLOUD_NAME` cloudinary cloud name 

`DATABASE_URL` postgress sql database url 

`FRONTEND_URL` url of your frontend this is only for production mode

`CLIENT_ID` google CLIENT_ID for varification of token come from the frontend

Now move to client folder and create .env file there and add these following environment variables to it 

`NEXTAUTH_URL` current url of your frontend application 

`NEXTAUTH_SECRET` secret a key for the next-auth


`NEXT_PUBLIC_BACKEND_URL` url of backend 

## Tech Stack

**Client:**     
1. TypeScript
2. Next.js
3. Tailwind CSS
4. ShadcnUI (Custom UI components for enhanced user experience built with redix ui)

**Server:**
1. Node,
2. Express,
3. Typescript
4. MongoDb


## License

This app is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License. Feel free to use it for your own projects.
