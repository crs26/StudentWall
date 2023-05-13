import * as React from "react";
import { render } from "react-dom";
import { StudentWall_backend as custom_greeting } from "../../declarations/StudentWall_backend";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "test",
    element: <div>Hello test!</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
