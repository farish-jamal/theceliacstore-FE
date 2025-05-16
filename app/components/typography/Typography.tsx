import React from "react";
import clsx from "clsx";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "blockquote"
  | "ul"
  | "ol"
  | "li";

type TypographyProps = {
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold",
  h2: "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
  h3: "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
  p: "",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  ol: "my-6 ml-6 list-decimal [&>li]:mt-2",
  li: "", // Handled via ul class above
};

export function Typography({
  variant = "p",
  className,
  children,
  ...props
}: TypographyProps) {
  const Component =
    variant === "ul" || variant === "ol"
      ? variant
      : (variant as keyof JSX.IntrinsicElements);

  return (
    <Component className={clsx(variantClasses[variant], className)} {...props}>
      {children}
    </Component>
  );
}
