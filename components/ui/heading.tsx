import { FC } from "react";

interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="">
      <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
