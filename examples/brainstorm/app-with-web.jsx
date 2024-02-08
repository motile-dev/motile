export const app = {
  pages: [
    {
      name: "home",
      component: <HomePage />,
      path: "/",
    },
  ],
  tables: [
    {
      users: {
        insert: [
          { handler: (data) => console.log(data), label: "Insert User" },
        ],
      },
    },
  ],
  actions: [
    {
      name: "home",
      path: "/contact-request"
      handler: (body) => { console.log(body)} 
    }
  ]
};
