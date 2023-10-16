import React, { Fragment } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function AttachementLoading() {
  return (
    <Fragment>
      <div className="mx-5 my-5">
        <Skeleton className="h-64" />
      </div>
      <div className="flex item-center space-x-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton className="h-16 w-16 " />
        ))}
      </div>
    </Fragment>
  );
}
