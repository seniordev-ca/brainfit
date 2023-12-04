import { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  onBottomVisible: () => void;
};

export function BottomVisibilityObserver({ children, onBottomVisible }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bottomElement = bottomRef.current;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        console.log('intersecting');
        onBottomVisible();
      }
    });

    if (bottomElement) {
      observer.observe(bottomElement);
    }

    return () => {
      if (bottomElement) {
        observer.unobserve(bottomElement);
      }
    };
  }, [bottomRef, onBottomVisible]);

  return (
    <>
      {children}
      <div className={'h-0 w-0'} ref={bottomRef} />
    </>
  );
}
