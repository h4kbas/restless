# Restless  Yet Another API Client for Rest APIs in Vanilla TS

Restless aims to create an object-like illusion for Rest-APIs.

## An example application for all possible use cases:

```javascript

import { Restless} from "./Restless";

document.addEventListener("DOMContentLoaded", async () => {
  const Source = Restless.init("https://jsonplaceholder.typicode.com");

  // $get GET Request
  const GetResult = await Source.posts.$get(1);
  const GetResultWithQuery = await Source.posts.$get(1, {limit: 5});
  
  // $post GET Request
  const PostResult = await Source.posts.update.$post(1, {title: "Hello World"});
  
  // Source URL generation
  const Posts = Source.posts.$dup();
  Posts.update.$post(1, {title: "Hello World"});

});

```