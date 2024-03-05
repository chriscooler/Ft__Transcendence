# TRANSCENDENCE

This is the final core-cursus project of the 42 school.
Soon, you will realize that you already know things that you thought you didn't.
The goal is to create a comprehensive, fully-featured website to organize a Pong competition.
We are required to utilize the NestJS backend framework.

## How to run the project

1. Ensuring your .env have `UID`,`SECRET` set and start Docker.

2. Using `docker-compose up --build` in terminal.

3. Connect to:'http://localhost:5173/' on Google Chrome.


## Docker commands
Command to start:  
`docker-compose up`

Command to build:
`docker-compose build`

Command to remove all images:  
`docker rmi -f $(docker images -a -q)`

Command to remove all containers:  
`docker rm -vf $(docker ps -a -q)`

Command to remove all images:  
`docker rmi -f $(docker images -a -q)`


## Why choose Svelte for the project?

Svelte, a remarkable JavaScript framework similar to React and Vue, brings groundbreaking features to the table, transforming the JavaScript landscape. 
By prioritizing native HTML APIs and ditching JSX, Svelte empowers developers, boosts performance, and streamlines packaging. 
As a compiler, it outshines its predecessors, offering a robust toolkit and an unparalleled developer experience from the get-go.

Unlike other frameworks, Svelte embraces existing APIs, fostering seamless integration and reducing dependency on additional tools. 
Its lightweight components, compiled during the build process, ensure optimal performance and compatibility with legacy systems. 
Svelte's simplicity and adherence to web standards facilitate swift adoption and seamless integration into existing projects. 
With unparalleled performance and developer-friendly design, Svelte stands out as a top choice for modern web development, poised to revolutionize the field.

For more details, check out the full article [here]:Top 5 Reasons You Should Use Svelte on Your Current Project Right Now (https://medium.com/@arxpoetica/top-5-reasons-you-should-use-svelte-on-your-current-project-right-now-e2f6835e904f).

,also [SvelteDoc](https://svelte.dev)

## Images of my website
### When the frontend port is up, we can enter to the main page via API42.
<img width="1280" alt="Screenshot 2024-03-05 at 08 17 22" src="https://github.com/chriscooler/ft_transcendence/assets/71888222/68382d68-41f7-44fd-a303-ff81d2671eaf">

### Connect to the 42API, ensuring your .env is set!
<img width="1276" alt="Screenshot 2024-03-05 at 18 07 51" src="https://github.com/chriscooler/ft_transcendence/assets/71888222/229b43a4-e48a-4d88-987a-f20a12f4d196">

### Main page with options.
<img width="1277" alt="Screenshot 2024-03-05 at 18 08 17" src="https://github.com/chriscooler/ft_transcendence/assets/71888222/24a770a1-590e-4bce-b18f-37629fe9cf5f">

### Friendship table displaying all your online friends, friend requests, offline users, and invitations to play.
<img width="1280" alt="Screenshot 2024-03-05 at 18 08 55" src="https://github.com/chriscooler/ft_transcendence/assets/71888222/b988bf9c-627c-4ed0-b1e4-4bf84a8e1231">

## Debug
	1. Open 3 terminals:

		Terminal 1 [DB]:
		Run `docker compose up --build` or `docker-compose up --build`.

		Terminal 2 [Backend]: (Once the DB is running)
		Navigate to './backend/'.
		(If dependencies are not installed after git cloning, run `npm install` or `npm i` to avoid Node installation!)
		Run `npm run start:dev`.

		Terminal 3 [Frontend]:
		Navigate to './frontend'.
		(If dependencies are not installed after git cloning, run `npm install` or `npm i`to avoid Node installation!)
		Run `npm run dev -- --open`.

	2. Connect to:'http://localhost:5173/'
