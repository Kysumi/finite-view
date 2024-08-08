import { Button } from "@renderer/components/ui/button";
import { Link } from "react-router-dom";

export const WelcomeRoute = () => {
  return (
    <div>
      <h1>Welcome to Finite View</h1>

      <h3>To use this application you will need to have an AWS account</h3>

      <Link to={"/getting-started"}>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};
