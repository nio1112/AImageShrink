/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.jsx' {
  import React from 'react';
  const JSXComponent: React.ComponentType<any>;
  export default JSXComponent;
}

declare module '*.js' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
} 