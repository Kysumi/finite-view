import { Button } from "@renderer/components/ui/button";
import { Link } from "react-router-dom";

export const WelcomeRoute = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Welcome to Finite View</h1>

      <h3>To use this application you will need to have an AWS account</h3>

      <Link to={"/getting-started"}>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};
