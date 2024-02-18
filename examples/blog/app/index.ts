import { Trigs } from "@trigs";
import { document } from "./pages/_document";

const cache =
  {
    index: `<html><body>${cache.post.123} < /body></html > `,
  components: {
    comment: {
      234: `hallo`
    },
    post: {
      123: `< div > Text < div > ${ cache.comment.234 } < /div></div > `
    }
  }
}

export const handlers = {
  posts: {
    insert: [{
      handler: () => {

      }, name: "render new post"
    }]
  }
} satisfies Trigs;
