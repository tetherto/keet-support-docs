'use client';

import NextLink from 'next/link';
import { Children, Fragment, forwardRef, type ComponentProps } from 'react';

/** Keys for Fumadocs sidebar/nav links that pass multiple children; does not alter content. */
export const KeyedNextLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof NextLink>
>(function KeyedNextLink({ children, ...props }, ref) {
  const keyed = Children.toArray(children).map((child, index) => (
    <Fragment key={index}>{child}</Fragment>
  ));

  return (
    <NextLink ref={ref} {...props}>
      {keyed}
    </NextLink>
  );
});
