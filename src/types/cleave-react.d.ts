// types/cleave-react.d.ts
declare module 'cleave.js/react' {
  import type * as React from 'react';

  interface CleaveProps extends React.InputHTMLAttributes<HTMLInputElement> {
    options: object;
    htmlRef?: any;
  }

  const Cleave: React.FC<CleaveProps>;
  export default Cleave;
}
