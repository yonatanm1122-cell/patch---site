import { quoteUrl } from "@/lib/quote";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Event type or service, added to the pre-written message */
  context?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "data-reveal"?: boolean;
};

/** Every "get a quote" button opens WhatsApp with a ready message. Falls back to the form if no number is set. */
export function QuoteLink({ children, className = "", context, onClick, ...rest }: Props) {
  const url = quoteUrl(context);
  if (!url) {
    return (
      <a href="/#contact" className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} data-quote {...rest}>
      {children}
      <span className="sr-only"> (נפתח בוואטסאפ)</span>
    </a>
  );
}
