'use client';
import React, { Fragment } from 'react';
import { Input } from '../ui/input';

export default function SearchBar() {
  return (
    <Fragment>
      <Input placeholder="Search or Start a new chat" type="text" />
    </Fragment>
  );
}
