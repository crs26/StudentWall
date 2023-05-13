import * as React from "react";
import { render } from "react-dom";
import { StudentWall_backend as custom_greeting } from "../../declarations/StudentWall_backend";

const MyHello = () => {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function doGreet() {
    const greeting = await custom_greeting.greet(name);
    setMessage(greeting);
  }

  return (
    <div className="col-10">hello</div>
  );
};

render(<MyHello />, document.getElementById("app"));