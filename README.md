![Frame 11](https://github.com/motile-dev/motile/assets/3687869/ea142bae-a2e0-4d8c-b064-112037ee9a06)

motile [ moht-l, moh-til ] adjective - moving or capable of moving spontaneously

Helps with postgres event sourcing in Typescript.

- Makes use of robust and battle tested mechanisms in postgres to provide a reliable and scalable event sourcing solution.
- Based on Elixir and Bun
- Get your first event handler up and running in minutes

## A first glance

Motile is still under heavy development and things are subject to change. However, here is a quick glance at what it looks like to use motile.

To get started, run the init script to create a new motile project.

```
pnpm create motile
```

You will be asked questions. Answer.

Here is what you need to do after the example project is created.

Change to the project directory.

```
cd motile-example
```

Since the example uses `Resend` to send emails, you need a free account there and then you get an API key. Add the API key to your `.env` file.

```
RESEND_API_KEY="your-api-key"
```

Use docker compose to start the database and the motile server.

```
pnpm run up
```

Use pg-migrate to create the tables.

```
pnpm run db.migrate
```

Run the project in dev mode.

```
pnpm run dev
```

The last command will start the motile CLI in watch mode. This does two things. First, it watches for changes to the schema of your database and syncs them so you have correct typings in your handlers. Second, it watches for changes to your handlers and syncs them to the server.

To see some action, change the email address that is used in the `app/users.ts` file to an email address that you have access to. Then connect to the database and add a user to the users table.
You should see an email in your inbox. You can also see that creating a user has lead to the creation of a welcome chat message in the corresponding table.

You can use the following command to connect to the database.

```
pnpm run studio
```
